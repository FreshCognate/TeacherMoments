import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import restoreScenarioById from '../services/restoreScenarioById.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

const buildModel = (scenario) => {
  const populate = vi.fn().mockResolvedValue(scenario);
  return { findByIdAndUpdate: vi.fn(() => ({ populate })) };
};

describe('restoreScenarioById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clears the deletion fields and stamps updatedAt/updatedBy', async () => {
    const Scenario = buildModel({ _id: 's1' });

    await restoreScenarioById(
      { scenarioId: 's1' },
      {},
      { models: { Scenario }, user: { _id: 'u1' } }
    );

    expect(Scenario.findByIdAndUpdate).toHaveBeenCalledWith('s1', {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      updatedAt: FIXED_NOW,
      updatedBy: 'u1'
    }, { new: true });
  });

  it('throws 404 when not found', async () => {
    const Scenario = buildModel(null);

    await expect(restoreScenarioById(
      { scenarioId: 'missing' },
      {},
      { models: { Scenario }, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });
});
