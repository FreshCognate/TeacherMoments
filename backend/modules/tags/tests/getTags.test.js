import { describe, it, expect, vi } from 'vitest';
import getTags from '../services/getTags.js';

const buildModels = (tags = [], count = tags.length) => ({
  Tag: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(tags) }))
  }
});

describe('getTags', () => {
  it('searches non-deleted tags by default', async () => {
    const models = buildModels();
    await getTags({}, {}, { models });
    expect(models.Tag.countDocuments).toHaveBeenCalledWith({ isDeleted: false });
  });

  it('honours an explicit isDeleted flag', async () => {
    const models = buildModels();
    await getTags({}, { isDeleted: true }, { models });
    expect(models.Tag.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ isDeleted: true }));
  });

  it('builds a name search when searchValue is set', async () => {
    const models = buildModels();
    await getTags({}, { searchValue: 'foo' }, { models });
    const search = models.Tag.countDocuments.mock.calls[0][0];
    expect(search.$or).toEqual([{ name: { $regex: 'foo', $options: 'i' } }]);
  });

  it('filters by tagType when supplied', async () => {
    const models = buildModels();
    await getTags({ tagType: 'CATEGORY' }, {}, { models });
    expect(models.Tag.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ tagType: 'CATEGORY' }));
  });

  it('paginates by 20 from page 2', async () => {
    const models = buildModels();
    await getTags({}, { currentPage: 2 }, { models });
    expect(models.Tag.find).toHaveBeenCalledWith(expect.any(Object), null, { skip: 20, limit: 20 });
  });

  it('returns tags, count, currentPage and totalPages', async () => {
    const models = buildModels([{ _id: 't1' }], 1);
    const result = await getTags({}, {}, { models });
    expect(result).toEqual({
      tags: [{ _id: 't1' }],
      count: 1,
      currentPage: 1,
      totalPages: 1
    });
  });

  it('sorts by name', async () => {
    const sort = vi.fn().mockResolvedValue([]);
    const find = vi.fn(() => ({ sort }));
    await getTags({}, {}, { models: { Tag: { countDocuments: vi.fn().mockResolvedValue(0), find } } });
    expect(sort).toHaveBeenCalledWith('name');
  });
});
