import { describe, it, expect, vi } from 'vitest';
import getPublishedBlocksByScenarioId from '../services/getPublishedBlocksByScenarioId.js';

const buildModelChain = (blocks) => {
  const populate2 = vi.fn().mockResolvedValue(blocks);
  const populate1 = vi.fn(() => ({ populate: populate2 }));
  const sort = vi.fn(() => ({ populate: populate1 }));
  return { find: vi.fn(() => ({ sort })) };
};

describe('getPublishedBlocksByScenarioId', () => {
  it('queries the Published_Block model with the scenario filter and isDeleted=false', async () => {
    const Published_Block = buildModelChain([]);
    await getPublishedBlocksByScenarioId({ scenarioId: 's1' }, {}, { models: { Published_Block } });

    expect(Published_Block.find).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
  });

  it('returns blocks wrapped in an object', async () => {
    const Published_Block = buildModelChain([{ _id: 'pb1' }]);
    const result = await getPublishedBlocksByScenarioId(
      { scenarioId: 's1' },
      {},
      { models: { Published_Block } }
    );
    expect(result).toEqual({ blocks: [{ _id: 'pb1' }] });
  });
});
