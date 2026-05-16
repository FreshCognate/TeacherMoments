import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getScenarioById from '../services/getScenarioById.js';

const buildModel = (scenario) => {
  const populate = vi.fn().mockResolvedValue(scenario);
  return { findById: vi.fn(() => ({ populate })) };
};

describe('getScenarioById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks access', async () => {
    const Scenario = buildModel({ _id: 's1' });
    const ctx = { models: { Scenario } };
    await getScenarioById({ scenarioId: 's1' }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, ctx);
  });

  it('returns the scenario when found', async () => {
    const scenario = { _id: 's1' };
    const Scenario = buildModel(scenario);
    const result = await getScenarioById({ scenarioId: 's1' }, {}, { models: { Scenario } });
    expect(result).toBe(scenario);
  });

  it('throws 404 when not found', async () => {
    const Scenario = buildModel(null);
    await expect(getScenarioById({ scenarioId: 'missing' }, {}, { models: { Scenario } }))
      .rejects.toMatchObject({ statusCode: 404 });
  });
});
