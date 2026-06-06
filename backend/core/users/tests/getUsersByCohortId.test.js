import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getUsersByCohortId from '../services/getUsersByCohortId.js';

const db = setupMongo();

const cohortId = new mongoose.Types.ObjectId();

describe('getUsersByCohortId (in-memory mongo)', () => {
  beforeEach(() => {});

  it('returns only non-deleted users in the cohort', async () => {
    await db.models.User.create({ email: 'in@x.com', lastName: 'In', role: 'ADMIN', cohorts: [{ cohort: cohortId }] });
    await db.models.User.create({ email: 'gone@x.com', lastName: 'Gone', role: 'ADMIN', cohorts: [{ cohort: cohortId }], isDeleted: true });
    await db.models.User.create({ email: 'other@x.com', lastName: 'Other', role: 'ADMIN', cohorts: [{ cohort: new mongoose.Types.ObjectId() }] });

    const result = await getUsersByCohortId({ cohortId }, {}, { models: db.models, user: { role: 'ADMIN' } });
    expect(result.users.map((u) => u.email)).toEqual(['in@x.com']);
  });

  it('excludes SUPER_ADMIN users for non-super-admin callers', async () => {
    await db.models.User.create({ email: 'super@x.com', lastName: 'Super', role: 'SUPER_ADMIN', cohorts: [{ cohort: cohortId }] });
    await db.models.User.create({ email: 'admin@x.com', lastName: 'Admin', role: 'ADMIN', cohorts: [{ cohort: cohortId }] });

    const result = await getUsersByCohortId({ cohortId }, {}, { models: db.models, user: { role: 'ADMIN' } });
    expect(result.users.map((u) => u.email)).toEqual(['admin@x.com']);
  });

  it('searches across firstName/lastName/email when searchValue is provided', async () => {
    await db.models.User.create({ email: 'sam@x.com', firstName: 'Sam', lastName: 'Smith', role: 'ADMIN', cohorts: [{ cohort: cohortId }] });
    await db.models.User.create({ email: 'jo@x.com', firstName: 'Jo', lastName: 'Jones', role: 'ADMIN', cohorts: [{ cohort: cohortId }] });

    const result = await getUsersByCohortId({ cohortId }, { searchValue: 'sam' }, { models: db.models, user: { role: 'ADMIN' } });
    expect(result.users.map((u) => u.email)).toEqual(['sam@x.com']);
  });

  it('returns users, count, currentPage and totalPages', async () => {
    await db.models.User.create({ email: 'a@x.com', lastName: 'A', role: 'ADMIN', cohorts: [{ cohort: cohortId }] });
    const result = await getUsersByCohortId({ cohortId }, {}, { models: db.models, user: { role: 'ADMIN' } });
    expect(result).toMatchObject({ count: 1, currentPage: 1, totalPages: 1 });
  });
});
