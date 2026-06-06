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

import getUserResponsesByCohortScenarios from '../services/getUserResponsesByCohortScenarios.js';

const db = setupMongo();

describe('getUserResponsesByCohortScenarios (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkCohortViewMock.mockResolvedValue();
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });
    buildUserScenarioResponseMock.mockResolvedValue({ blockResponses: [] });
  });

  it('checks cohort view access', async () => {
    const cohortId = new mongoose.Types.ObjectId();
    const user = await db.models.User.create({ email: 'u@x.com', cohorts: [{ cohort: cohortId }] });
    const ctx = { models: db.models };

    await getUserResponsesByCohortScenarios({ userId: user._id, cohortId }, {}, ctx);
    expect(checkCohortViewMock).toHaveBeenCalledWith({ cohortId }, ctx);
  });

  it('throws 404 when the user is not in the cohort', async () => {
    await expect(
      getUserResponsesByCohortScenarios(
        { userId: new mongoose.Types.ObjectId(), cohortId: new mongoose.Types.ObjectId() },
        {},
        { models: db.models }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('builds a response for each non-deleted scenario in the cohort', async () => {
    const cohortId = new mongoose.Types.ObjectId();
    const user = await db.models.User.create({ email: 'u@x.com', cohorts: [{ cohort: cohortId }] });

    await db.models.Scenario.create([
      { name: 'A', cohorts: [{ cohort: cohortId }] },
      { name: 'B', cohorts: [{ cohort: cohortId }] },
      { name: 'Deleted', cohorts: [{ cohort: cohortId }], isDeleted: true }
    ]);

    const result = await getUserResponsesByCohortScenarios(
      { userId: user._id, cohortId }, {}, { models: db.models }
    );

    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
    expect(result.responses).toHaveLength(2);
    expect(result.count).toBe(2);
    expect(String(result.user._id)).toBe(String(user._id));
  });
});
