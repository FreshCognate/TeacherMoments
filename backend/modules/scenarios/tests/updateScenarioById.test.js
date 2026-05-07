import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock, setScenarioHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setScenarioHasChangesMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));
vi.mock('../services/setScenarioHasChanges.js', () => ({ default: (...args) => setScenarioHasChangesMock(...args) }));

import updateScenarioById from '../services/updateScenarioById.js';

const buildModel = (scenario) => {
  const populate = vi.fn().mockResolvedValue(scenario);
  return { findByIdAndUpdate: vi.fn(() => ({ populate })) };
};

describe('updateScenarioById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('applies the update', async () => {
    const Scenario = buildModel({ _id: 's1', name: 'New' });

    await updateScenarioById(
      { scenarioId: 's1', update: { name: 'New' } },
      {},
      { models: { Scenario } }
    );

    expect(Scenario.findByIdAndUpdate).toHaveBeenCalledWith('s1', { name: 'New' }, { new: true });
  });

  it('throws 404 when not found', async () => {
    const Scenario = buildModel(null);
    await expect(updateScenarioById(
      { scenarioId: 'missing', update: {} },
      {},
      { models: { Scenario } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });

  it('marks the scenario as having changes after a successful update', async () => {
    const Scenario = buildModel({ _id: 's1' });
    const ctx = { models: { Scenario } };

    await updateScenarioById({ scenarioId: 's1', update: {} }, {}, ctx);

    expect(setScenarioHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, ctx);
  });
});
