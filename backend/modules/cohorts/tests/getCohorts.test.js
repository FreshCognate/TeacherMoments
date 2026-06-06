import { describe, it, expect, vi } from 'vitest';
import getCohorts from '../services/getCohorts.js';

const buildModels = (cohorts = [], count = cohorts.length) => ({
  Cohort: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(cohorts) }))
  }
});

const baseUser = { _id: 'u1', cohorts: [{ cohort: 'c-mine' }], role: 'USER' };

describe('getCohorts', () => {
  it('searches with isArchived=false and isDeleted=false by default', async () => {
    const models = buildModels();
    await getCohorts({}, {}, { models, user: baseUser });
    expect(models.Cohort.countDocuments).toHaveBeenCalledWith(expect.objectContaining({
      isArchived: false,
      isDeleted: false
    }));
  });

  it('combines the searchValue with the access filter using $and of two $or clauses', async () => {
    const models = buildModels();
    await getCohorts({}, { searchValue: 'spring' }, { models, user: baseUser });
    const search = models.Cohort.countDocuments.mock.calls[0][0];

    expect(search.$and).toBeDefined();
    expect(search.$and).toHaveLength(2);

    const accessClause = search.$and.find((clause) => clause.$or.some((o) => o._id));
    expect(accessClause).toBeDefined();

    const searchClause = search.$and.find((clause) => clause.$or.some((o) => o.name));
    expect(searchClause).toBeDefined();
    expect(searchClause.$or[0]).toEqual({ name: { $regex: 'spring', $options: 'i' } });
  });

  it('always includes the users own cohorts in the access filter', async () => {
    const models = buildModels();
    await getCohorts({}, {}, { models, user: { ...baseUser, cohorts: [{ cohort: 'c1' }, { cohort: 'c2' }] } });
    const search = models.Cohort.countDocuments.mock.calls[0][0];
    const userCohorts = search.$or.find((c) => c._id);
    expect(userCohorts).toEqual({ _id: { $in: ['c1', 'c2'] } });
  });

  it('adds a collaborator branch to the access filter for ADMIN/FACILITATOR', async () => {
    const models = buildModels();
    await getCohorts({}, {}, { models, user: { ...baseUser, role: 'ADMIN' } });
    const search = models.Cohort.countDocuments.mock.calls[0][0];
    const collabBranch = search.$or.find((c) => c.collaborators);
    expect(collabBranch).toBeDefined();
    expect(collabBranch.collaborators.$elemMatch.user).toBe('u1');
  });

  it('applies no access filter for SUPER_ADMIN', async () => {
    const models = buildModels();
    await getCohorts({}, {}, { models, user: { ...baseUser, role: 'SUPER_ADMIN' } });
    const search = models.Cohort.countDocuments.mock.calls[0][0];
    expect(search.$or).toBeUndefined();
    expect(search.$and).toBeUndefined();
  });

  it('still applies the search term for SUPER_ADMIN without an access filter', async () => {
    const models = buildModels();
    await getCohorts({}, { searchValue: 'spring' }, { models, user: { ...baseUser, role: 'SUPER_ADMIN' } });
    const search = models.Cohort.countDocuments.mock.calls[0][0];
    expect(search.$and).toBeUndefined();
    expect(search.$or).toEqual([{ name: { $regex: 'spring', $options: 'i' } }]);
  });

  it('does not add a collaborator branch for plain USERs', async () => {
    const models = buildModels();
    await getCohorts({}, {}, { models, user: baseUser });
    const search = models.Cohort.countDocuments.mock.calls[0][0];
    expect(search.$or).toHaveLength(1);
  });

  it('sorts by -createdAt for sortBy=NEWEST', async () => {
    const sortMock = vi.fn().mockResolvedValue([]);
    const models = {
      Cohort: {
        countDocuments: vi.fn().mockResolvedValue(0),
        find: vi.fn(() => ({ sort: sortMock }))
      }
    };
    await getCohorts({}, { sortBy: 'NEWEST' }, { models, user: baseUser });
    expect(sortMock).toHaveBeenCalledWith('-createdAt');
  });

  it('sorts by createdAt for sortBy=OLDEST', async () => {
    const sortMock = vi.fn().mockResolvedValue([]);
    const models = {
      Cohort: {
        countDocuments: vi.fn().mockResolvedValue(0),
        find: vi.fn(() => ({ sort: sortMock }))
      }
    };
    await getCohorts({}, { sortBy: 'OLDEST' }, { models, user: baseUser });
    expect(sortMock).toHaveBeenCalledWith('createdAt');
  });

  it('sorts by name by default', async () => {
    const sortMock = vi.fn().mockResolvedValue([]);
    const models = {
      Cohort: {
        countDocuments: vi.fn().mockResolvedValue(0),
        find: vi.fn(() => ({ sort: sortMock }))
      }
    };
    await getCohorts({}, {}, { models, user: baseUser });
    expect(sortMock).toHaveBeenCalledWith('name');
  });

  it('returns cohorts, count, currentPage, totalPages', async () => {
    const models = buildModels([{ _id: 'c1' }], 1);
    const result = await getCohorts({}, {}, { models, user: baseUser });
    expect(result).toEqual({ cohorts: [{ _id: 'c1' }], count: 1, currentPage: 1, totalPages: 1 });
  });
});
