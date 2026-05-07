import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock, setScenarioHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setScenarioHasChangesMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));
vi.mock('../services/setScenarioHasChanges.js', () => ({ default: (...args) => setScenarioHasChangesMock(...args) }));

import addCollaboratorsToScenario from '../services/addCollaboratorsToScenario.js';

describe('addCollaboratorsToScenario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws 404 when the scenario does not exist', async () => {
    const models = {
      Scenario: { findById: vi.fn().mockResolvedValue(null), findByIdAndUpdate: vi.fn() }
    };

    await expect(addCollaboratorsToScenario(
      { scenarioId: 'missing', collaborators: ['u1'] },
      {},
      { models, user: { _id: 'u-actor' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });

  it('adds only collaborators not already on the scenario, with role AUTHOR', async () => {
    const models = {
      Scenario: {
        findById: vi.fn().mockResolvedValue({ collaborators: [{ user: 'u-existing' }] }),
        findByIdAndUpdate: vi.fn().mockResolvedValue({})
      }
    };

    await addCollaboratorsToScenario(
      { scenarioId: 's1', collaborators: ['u-existing', 'u-new-1', 'u-new-2'] },
      {},
      { models, user: { _id: 'u-actor' } }
    );

    expect(models.Scenario.findByIdAndUpdate).toHaveBeenCalledWith('s1', {
      $push: {
        collaborators: [
          { role: 'AUTHOR', user: 'u-new-1' },
          { role: 'AUTHOR', user: 'u-new-2' }
        ]
      }
    });
  });

  it('marks the scenario as having changes', async () => {
    const models = {
      Scenario: {
        findById: vi.fn().mockResolvedValue({ collaborators: [] }),
        findByIdAndUpdate: vi.fn().mockResolvedValue({})
      }
    };
    const ctx = { models, user: { _id: 'u-actor' } };

    await addCollaboratorsToScenario(
      { scenarioId: 's1', collaborators: ['u-new'] },
      {},
      ctx
    );

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, ctx);
  });
});
