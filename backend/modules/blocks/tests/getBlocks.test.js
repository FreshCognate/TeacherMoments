import { describe, it, expect, vi } from 'vitest';
import getBlocks from '../services/getBlocks.js';

const buildModels = (blocks = [], count = blocks.length) => ({
  Block: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(blocks) }))
  }
});

describe('getBlocks', () => {
  it('searches with isDeleted=false by default', async () => {
    const models = buildModels();
    await getBlocks({}, {}, { models });
    expect(models.Block.countDocuments).toHaveBeenCalledWith({ isDeleted: false });
  });

  it('honours an explicit scenario filter', async () => {
    const models = buildModels();
    await getBlocks({ scenario: 's1' }, {}, { models });
    expect(models.Block.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ scenario: 's1' }));
  });

  it('builds a search on name when searchValue is set', async () => {
    const models = buildModels();
    await getBlocks({}, { searchValue: 'foo' }, { models });
    const search = models.Block.countDocuments.mock.calls[0][0];
    expect(search.$or).toEqual([{ name: { $regex: 'foo', $options: 'i' } }]);
  });

  it('paginates by 20 by default', async () => {
    const models = buildModels();
    await getBlocks({}, { currentPage: 2 }, { models });
    expect(models.Block.find).toHaveBeenCalledWith(expect.any(Object), null, { skip: 20, limit: 20 });
  });

  it('returns blocks, count, currentPage, totalPages', async () => {
    const models = buildModels([{ _id: 'b1' }], 1);
    const result = await getBlocks({}, {}, { models });
    expect(result).toEqual({
      blocks: [{ _id: 'b1' }],
      count: 1,
      currentPage: 1,
      totalPages: 1
    });
  });
});
