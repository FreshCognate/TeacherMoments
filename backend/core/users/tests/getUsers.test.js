import { describe, it, expect, vi } from 'vitest';
import getUsers from '../services/getUsers.js';

const buildModels = (users = [], count = users.length) => ({
  User: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(users) }))
  }
});

describe('getUsers', () => {
  it('filters by isDeleted (default false)', async () => {
    const models = buildModels();
    await getUsers({}, {}, { models, user: { role: 'ADMIN' } });
    expect(models.User.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ isDeleted: false }));
  });

  it('respects an explicit isDeleted value', async () => {
    const models = buildModels();
    await getUsers({}, { isDeleted: true }, { models, user: { role: 'ADMIN' } });
    expect(models.User.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ isDeleted: true }));
  });

  it('excludes SUPER_ADMIN users for non-super-admin callers', async () => {
    const models = buildModels();
    await getUsers({}, {}, { models, user: { role: 'ADMIN' } });
    const search = models.User.countDocuments.mock.calls[0][0];
    expect(search.role).toEqual({ $ne: 'SUPER_ADMIN' });
  });

  it('does not exclude SUPER_ADMIN users when the caller is a SUPER_ADMIN', async () => {
    const models = buildModels();
    await getUsers({}, {}, { models, user: { role: 'SUPER_ADMIN' } });
    const search = models.User.countDocuments.mock.calls[0][0];
    expect(search.role).toBeUndefined();
  });

  it('builds a $or regex search across firstName/lastName/email when searchValue is provided', async () => {
    const models = buildModels();
    await getUsers({}, { searchValue: 'sam' }, { models, user: { role: 'ADMIN' } });
    const search = models.User.countDocuments.mock.calls[0][0];
    expect(search.$or).toEqual([
      { firstName: { $regex: 'sam', $options: 'i' } },
      { lastName: { $regex: 'sam', $options: 'i' } },
      { email: { $regex: 'sam', $options: 'i' } }
    ]);
  });

  it('paginates by 20 by default', async () => {
    const models = buildModels();
    await getUsers({}, { currentPage: 3 }, { models, user: { role: 'ADMIN' } });
    expect(models.User.find).toHaveBeenCalledWith(expect.any(Object), null, { skip: 40, limit: 20 });
  });

  it('returns users, count, currentPage, and totalPages', async () => {
    const models = buildModels([{ _id: 'u1' }, { _id: 'u2' }], 45);
    const result = await getUsers({}, { currentPage: 1 }, { models, user: { role: 'ADMIN' } });

    expect(result).toEqual({
      users: [{ _id: 'u1' }, { _id: 'u2' }],
      count: 45,
      currentPage: 1,
      totalPages: 3
    });
  });

  it('parses currentPage as an integer', async () => {
    const models = buildModels();
    const result = await getUsers({}, { currentPage: '2' }, { models, user: { role: 'ADMIN' } });
    expect(result.currentPage).toBe(2);
  });
});
