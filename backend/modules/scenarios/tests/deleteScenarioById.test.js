import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import deleteScenarioById from '../services/deleteScenarioById.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

describe('deleteScenarioById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('soft-deletes the scenario with timestamp and actor', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 's1', isDeleted: true });

    await deleteScenarioById(
      { scenarioId: 's1' },
      {},
      { models: { Scenario: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('s1', {
      isDeleted: true,
      deletedAt: FIXED_NOW,
      deletedBy: 'u1'
    }, { new: true });
  });

  it('throws 404 when not found', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(deleteScenarioById(
      { scenarioId: 'missing' },
      {},
      { models: { Scenario: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });
});
