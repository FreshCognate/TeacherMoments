import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkCohortViewMock, getScenarioSlidesAndBlocksByRefMock, buildUserScenarioResponseMock } = vi.hoisted(() => ({
  checkCohortViewMock: vi.fn(),
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn()
}));

vi.mock('../../cohorts/helpers/checkHasAccessToViewCohort.js', () => ({ default: (...args) => checkCohortViewMock(...args) }));
vi.mock('../helpers/getScenarioSlidesAndBlocksByRef.js', () => ({ default: (...args) => getScenarioSlidesAndBlocksByRefMock(...args) }));
vi.mock('../helpers/buildUserScenarioResponse.js', () => ({ default: (...args) => buildUserScenarioResponseMock(...args) }));

import getUsersResponsesByCohortAndScenario from '../services/getUsersResponsesByCohortAndScenario.js';

const db = setupMongo();

describe('getUsersResponsesByCohortAndScenario (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkCohortViewMock.mockResolvedValue();
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });
    buildUserScenarioResponseMock.mockResolvedValue({ blockResponses: [] });
  });

  it('checks cohort view access', async () => {
    const cohortId = new mongoose.Types.ObjectId();
    const scenario = await db.models.Scenario.create({ name: 'S' });
    const ctx = { models: db.models };

    await getUsersResponsesByCohortAndScenario({ cohortId, scenarioId: scenario._id }, {}, ctx);
    expect(checkCohortViewMock).toHaveBeenCalledWith({ cohortId }, ctx);
  });

  it('returns only users in the cohort, filtered by username search', async () => {
    const cohortId = new mongoose.Types.ObjectId();
    const scenario = await db.models.Scenario.create({ name: 'S' });

    const sam = await db.models.User.create({ email: 'sam@x.com', username: 'sam', cohorts: [{ cohort: cohortId }] });
    await db.models.User.create({ email: 'jo@x.com', username: 'jo', cohorts: [{ cohort: cohortId }] });
    // Different cohort — must be excluded.
    await db.models.User.create({ email: 'other@x.com', username: 'sammy', cohorts: [{ cohort: new mongoose.Types.ObjectId() }] });

    const result = await getUsersResponsesByCohortAndScenario(
      { cohortId, scenarioId: scenario._id },
      { searchValue: 'sam' },
      { models: db.models }
    );

    expect(result.responses.map((r) => String(r.user._id))).toEqual([String(sam._id)]);
  });

  it('builds one response per user with the same scenario attached', async () => {
    const cohortId = new mongoose.Types.ObjectId();
    const scenario = await db.models.Scenario.create({ name: 'Test' });

    await db.models.User.create({ email: 'u1@x.com', cohorts: [{ cohort: cohortId }] });
    await db.models.User.create({ email: 'u2@x.com', cohorts: [{ cohort: cohortId }] });

    const result = await getUsersResponsesByCohortAndScenario(
      { cohortId, scenarioId: scenario._id }, {}, { models: db.models }
    );

    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
    expect(result.responses).toHaveLength(2);
    expect(String(result.scenario._id)).toBe(String(scenario._id));
  });
});
