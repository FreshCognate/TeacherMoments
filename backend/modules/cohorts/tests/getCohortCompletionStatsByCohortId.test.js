import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import find from 'lodash/find.js';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToViewCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import getCohortCompletionStatsByCohortId from '../services/getCohortCompletionStatsByCohortId.js';

const db = setupMongo();

const cohortId = new mongoose.Types.ObjectId();

const seedUsersInCohort = (n) => Promise.all(
  Array.from({ length: n }, (_unused, i) =>
    db.models.User.create({ email: `u${i}@example.com`, cohorts: [{ cohort: cohortId }] })
  )
);

describe('getCohortCompletionStatsByCohortId (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('returns zero stats when the cohort has no scenarios', async () => {
    await seedUsersInCohort(5);

    const result = await getCohortCompletionStatsByCohortId(
      { cohortId: String(cohortId) }, {}, { models: db.models }
    );

    expect(result).toEqual({ totalUsers: 5, scenarioCompletions: [], cohortCompletionCount: 0 });
  });

  it('returns per-scenario completions and a cohort-wide count when users completed everything', async () => {
    const [u1, u2, u3] = await seedUsersInCohort(3);
    const s1 = await db.models.Scenario.create({ name: 'S1', cohorts: [{ cohort: cohortId }] });
    const s2 = await db.models.Scenario.create({ name: 'S2', cohorts: [{ cohort: cohortId }] });

    await db.models.Run.create([
      { scenario: s1._id, user: u1._id, isComplete: true },
      { scenario: s1._id, user: u2._id, isComplete: true },
      { scenario: s1._id, user: u3._id, isComplete: true },
      { scenario: s2._id, user: u1._id, isComplete: true },
      { scenario: s2._id, user: u2._id, isComplete: true }
    ]);

    const result = await getCohortCompletionStatsByCohortId(
      { cohortId: String(cohortId) }, {}, { models: db.models }
    );

    expect(find(result.scenarioCompletions, { scenarioId: String(s1._id) }).completedCount).toBe(3);
    expect(find(result.scenarioCompletions, { scenarioId: String(s2._id) }).completedCount).toBe(2);
    // Only u1 and u2 completed both scenarios.
    expect(result.cohortCompletionCount).toBe(2);
  });

  it('returns cohortCompletionCount=0 when not every scenario has completion data', async () => {
    const [u1, u2, u3] = await seedUsersInCohort(3);
    const s1 = await db.models.Scenario.create({ name: 'S1', cohorts: [{ cohort: cohortId }] });
    await db.models.Scenario.create({ name: 'S2', cohorts: [{ cohort: cohortId }] });

    await db.models.Run.create([
      { scenario: s1._id, user: u1._id, isComplete: true },
      { scenario: s1._id, user: u2._id, isComplete: true },
      { scenario: s1._id, user: u3._id, isComplete: true }
    ]);

    const result = await getCohortCompletionStatsByCohortId(
      { cohortId: String(cohortId) }, {}, { models: db.models }
    );

    expect(result.cohortCompletionCount).toBe(0);
  });
});
