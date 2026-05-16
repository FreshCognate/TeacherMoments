import { describe, it, expect, vi } from 'vitest';
import getPublishedTriggersByScenarioId from '../services/getPublishedTriggersByScenarioId.js';

describe('getPublishedTriggersByScenarioId', () => {
  it('queries Published_Trigger for non-deleted triggers sorted by sortOrder', async () => {
    const sort = vi.fn().mockResolvedValue([{ _id: 't1' }]);
    const find = vi.fn(() => ({ sort }));

    const result = await getPublishedTriggersByScenarioId(
      { scenarioId: 's1' },
      {},
      { models: { Published_Trigger: { find } } }
    );

    expect(find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
    expect(sort).toHaveBeenCalledWith('sortOrder');
    expect(result).toEqual({ triggers: [{ _id: 't1' }] });
  });
});
