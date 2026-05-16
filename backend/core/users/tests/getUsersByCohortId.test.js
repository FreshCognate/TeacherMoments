import { describe, it, expect, vi } from 'vitest';
import getUsersByCohortId from '../services/getUsersByCohortId.js';

const buildModels = (users = [], count = users.length) => ({
  User: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(users) }))
  }
});

describe('getUsersByCohortId', () => {
  it('filters by cohorts.cohort and isDeleted', async () => {
    const models = buildModels();
    await getUsersByCohortId({ cohortId: 'cohort-1' }, {}, { models, user: { role: 'ADMIN' } });

    const search = models.User.countDocuments.mock.calls[0][0];
    expect(search['cohorts.cohort']).toBe('cohort-1');
    expect(search.isDeleted).toBe(false);
  });

  it('excludes SUPER_ADMIN users for non-super-admin callers', async () => {
    const models = buildModels();
    await getUsersByCohortId({ cohortId: 'cohort-1' }, {}, { models, user: { role: 'ADMIN' } });
    expect(models.User.countDocuments.mock.calls[0][0].role).toEqual({ $ne: 'SUPER_ADMIN' });
  });

  it('builds a search across firstName/lastName/email when searchValue is provided', async () => {
    const models = buildModels();
    await getUsersByCohortId({ cohortId: 'cohort-1' }, { searchValue: 'sam' }, { models, user: { role: 'ADMIN' } });

    const search = models.User.countDocuments.mock.calls[0][0];
    expect(search.$or).toHaveLength(3);
  });

  it('returns users, count, currentPage and totalPages', async () => {
    const models = buildModels([{ _id: 'u1' }], 1);
    const result = await getUsersByCohortId({ cohortId: 'cohort-1' }, {}, { models, user: { role: 'ADMIN' } });

    expect(result).toEqual({
      users: [{ _id: 'u1' }],
      count: 1,
      currentPage: 1,
      totalPages: 1
    });
  });
});
