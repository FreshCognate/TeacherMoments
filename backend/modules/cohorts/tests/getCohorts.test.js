import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getCohorts from '../services/getCohorts.js';

const db = setupMongo();

const userId = new mongoose.Types.ObjectId();

const seedCohort = (overrides = {}) => db.models.Cohort.create({ name: 'Cohort', ...overrides });

const userWith = (cohortIds, extra = {}) => ({
  _id: userId,
  role: 'USER',
  cohorts: cohortIds.map((cohort) => ({ cohort })),
  ...extra
});

describe('getCohorts (in-memory mongo)', () => {
  beforeEach(() => {});

  it('excludes archived and deleted cohorts by default', async () => {
    const active = await seedCohort({ name: 'Active' });
    const archived = await seedCohort({ name: 'Archived', isArchived: true });
    const deleted = await seedCohort({ name: 'Deleted', isDeleted: true });

    const { cohorts, count } = await getCohorts(
      {}, {},
      { models: db.models, user: userWith([active._id, archived._id, deleted._id]) }
    );

    const ids = cohorts.map((c) => String(c._id));
    expect(ids).toContain(String(active._id));
    expect(ids).not.toContain(String(archived._id));
    expect(ids).not.toContain(String(deleted._id));
    expect(count).toBe(1);
  });

  it('filters by the search value (name, case-insensitive)', async () => {
    const spring = await seedCohort({ name: 'Spring Cohort' });
    const autumn = await seedCohort({ name: 'Autumn Cohort' });

    const { cohorts } = await getCohorts(
      {}, { searchValue: 'spring' },
      { models: db.models, user: userWith([spring._id, autumn._id]) }
    );

    expect(cohorts.map((c) => String(c._id))).toEqual([String(spring._id)]);
  });

  it('only returns a USER\'s own cohorts', async () => {
    const mine = await seedCohort({ name: 'Mine' });
    const other = await seedCohort({ name: 'Other' });

    const { cohorts } = await getCohorts(
      {}, {},
      { models: db.models, user: userWith([mine._id]) }
    );

    expect(cohorts.map((c) => String(c._id))).toEqual([String(mine._id)]);
  });

  it('also returns cohorts where an ADMIN is a collaborator', async () => {
    const collaborating = await seedCohort({
      name: 'Collab',
      collaborators: [{ user: userId, role: 'OWNER' }]
    });

    const { cohorts } = await getCohorts(
      {}, {},
      { models: db.models, user: userWith([], { role: 'ADMIN' }) }
    );

    expect(cohorts.map((c) => String(c._id))).toEqual([String(collaborating._id)]);
  });

  it('returns all cohorts for SUPER_ADMIN regardless of membership', async () => {
    const a = await seedCohort({ name: 'A' });
    const b = await seedCohort({ name: 'B' });

    const { cohorts, count } = await getCohorts(
      {}, {},
      { models: db.models, user: userWith([], { role: 'SUPER_ADMIN' }) }
    );

    const ids = cohorts.map((c) => String(c._id));
    expect(ids).toEqual(expect.arrayContaining([String(a._id), String(b._id)]));
    expect(count).toBe(2);
  });

  it('sorts by name by default and by createdAt for NEWEST/OLDEST', async () => {
    const second = await seedCohort({ name: 'Bravo' });
    const first = await seedCohort({ name: 'Alpha' });

    const byName = await getCohorts(
      {}, {},
      { models: db.models, user: userWith([], { role: 'SUPER_ADMIN' }) }
    );
    expect(byName.cohorts.map((c) => c.name)).toEqual(['Alpha', 'Bravo']);

    const newest = await getCohorts(
      {}, { sortBy: 'NEWEST' },
      { models: db.models, user: userWith([], { role: 'SUPER_ADMIN' }) }
    );
    expect(newest.cohorts.map((c) => String(c._id))).toEqual([String(first._id), String(second._id)]);
  });

  it('returns count, currentPage and totalPages', async () => {
    const mine = await seedCohort({ name: 'Mine' });

    const result = await getCohorts(
      {}, {},
      { models: db.models, user: userWith([mine._id]) }
    );

    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
  });
});
