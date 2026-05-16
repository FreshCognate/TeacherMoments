import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock, setScenarioHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setScenarioHasChangesMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));
vi.mock('../services/setScenarioHasChanges.js', () => ({ default: (...args) => setScenarioHasChangesMock(...args) }));

import removeCollaboratorsFromScenario from '../services/removeCollaboratorsFromScenario.js';

describe('removeCollaboratorsFromScenario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws 404 when the scenario does not exist', async () => {
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(null), findByIdAndUpdate: vi.fn() }
    };

    await expect(removeCollaboratorsFromScenario(
      { scenarioId: 'missing', collaborators: ['u1'] },
      {},
      { models, user: {} }
    )).rejects.toMatchObject({ statusCode: 404 });
  });

  it('pulls the matching collaborators from the scenario', async () => {
    const models = {
      Scenario: {
        findById: vi.fn().mockResolvedValue({ collaborators: [] }),
        findByIdAndUpdate: vi.fn().mockResolvedValue({})
      }
    };

    await removeCollaboratorsFromScenario(
      { scenarioId: 's1', collaborators: ['u1', 'u2'] },
      {},
      { models, user: {} }
    );

    expect(models.Scenario.findByIdAndUpdate).toHaveBeenCalledWith('s1', {
      $pull: { collaborators: { user: { $in: ['u1', 'u2'] } } }
    });
  });

  it('marks the scenario as having changes', async () => {
    const models = {
      Scenario: {
        findById: vi.fn().mockResolvedValue({ collaborators: [] }),
        findByIdAndUpdate: vi.fn().mockResolvedValue({})
      }
    };
    const ctx = { models, user: {} };

    await removeCollaboratorsFromScenario(
      { scenarioId: 's1', collaborators: ['u1'] },
      {},
      ctx
    );

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, ctx);
  });
});
