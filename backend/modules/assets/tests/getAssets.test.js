import { describe, it, expect, vi } from 'vitest';
import getAssets from '../services/getAssets.js';

const buildModels = (assets = [], count = assets.length) => ({
  Asset: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(assets) }))
  }
});

describe('getAssets', () => {
  it('searches with isDeleted=false by default', async () => {
    const models = buildModels();
    await getAssets({}, {}, { models });
    expect(models.Asset.countDocuments).toHaveBeenCalledWith({ isDeleted: false });
  });

  it('supports an explicit isDeleted=true', async () => {
    const models = buildModels();
    await getAssets({}, { isDeleted: true }, { models });
    expect(models.Asset.countDocuments).toHaveBeenCalledWith({ isDeleted: true });
  });

  it('builds a regex search on name when searchValue is set', async () => {
    const models = buildModels();
    await getAssets({}, { searchValue: 'photo' }, { models });
    const search = models.Asset.countDocuments.mock.calls[0][0];
    expect(search.$or).toEqual([{ name: { $regex: 'photo', $options: 'i' } }]);
  });

  it('paginates by 20 by default', async () => {
    const models = buildModels();
    await getAssets({}, { currentPage: 2 }, { models });
    expect(models.Asset.find).toHaveBeenCalledWith(expect.any(Object), null, { skip: 20, limit: 20 });
  });

  it('returns assets, count, currentPage, totalPages', async () => {
    const models = buildModels([{ _id: 'a1' }], 25);
    const result = await getAssets({}, { currentPage: 1 }, { models });
    expect(result).toEqual({
      assets: [{ _id: 'a1' }],
      count: 25,
      currentPage: 1,
      totalPages: 2
    });
  });
});
