import { describe, it, expect, vi } from 'vitest';
import getPublishedSlidesByScenarioId from '../services/getPublishedSlidesByScenarioId.js';

describe('getPublishedSlidesByScenarioId', () => {
  it('queries Published_Slide for non-deleted slides on the scenario', async () => {
    const find = vi.fn().mockResolvedValue([{ _id: 'sl1' }]);

    const result = await getPublishedSlidesByScenarioId(
      { scenarioId: 's1' },
      {},
      { models: { Published_Slide: { find } } }
    );

    expect(find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
    expect(result).toEqual({ slides: [{ _id: 'sl1' }] });
  });
});
