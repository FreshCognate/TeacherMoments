import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkCohortViewMock } = vi.hoisted(() => ({ checkCohortViewMock: vi.fn() }));

vi.mock('../../cohorts/helpers/checkHasAccessToViewCohort.js', () => ({
  default: (...args) => checkCohortViewMock(...args)
}));

import getUsersRunsByCohortId from '../services/getUsersRunsByCohortId.js';

const db = setupMongo();

describe('getUsersRunsByCohortId (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkCohortViewMock.mockResolvedValue();
  });

  it('checks cohort view access', async () => {
    const cohortId = new mongoose.Types.ObjectId();
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() } };
    await getUsersRunsByCohortId({ cohortId }, {}, ctx);
    expect(checkCohortViewMock).toHaveBeenCalledWith({ cohortId }, ctx);
  });

  it('returns the user\'s non-deleted runs for the non-deleted scenarios in the cohort', async () => {
    const cohortId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const s1 = await db.models.Scenario.create({ name: 'S1', cohorts: [{ cohort: cohortId }] });
    const s2 = await db.models.Scenario.create({ name: 'S2', cohorts: [{ cohort: cohortId }] });
    // Not in the cohort.
    const other = await db.models.Scenario.create({ name: 'Other' });

    const r1 = await db.models.Run.create({ scenario: s1._id, user: userId });
    await db.models.Run.create({ scenario: s2._id, user: new mongoose.Types.ObjectId() }); // another user
    await db.models.Run.create({ scenario: other._id, user: userId }); // scenario not in cohort
    await db.models.Run.create({ scenario: s1._id, user: userId, isDeleted: true }); // deleted

    const result = await getUsersRunsByCohortId({ cohortId }, {}, { models: db.models, user: { _id: userId } });

    expect(result.runs.map((r) => String(r._id))).toEqual([String(r1._id)]);
  });

  it('returns an empty runs list when the cohort has no scenarios', async () => {
    const result = await getUsersRunsByCohortId(
      { cohortId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
    );
    expect(result).toEqual({ runs: [] });
  });
});
