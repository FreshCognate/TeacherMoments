import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import find from 'lodash/find.js';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import removeScenarioFromCohort from '../services/removeScenarioFromCohort.js';

const db = setupMongo();

describe('removeScenarioFromCohort (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('pulls the cohort from the scenario.cohorts list', async () => {
    const cohort = await db.models.Cohort.create({ name: 'C' });
    const otherCohort = new mongoose.Types.ObjectId();
    const scenario = await db.models.Scenario.create({
      name: 'S',
      cohorts: [
        { cohort: cohort._id, sortOrder: 0 },
        { cohort: otherCohort, sortOrder: 1 }
      ]
    });

    await removeScenarioFromCohort(
      { cohortId: cohort._id, update: { scenarioId: scenario._id } },
      {},
      { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
    );

    const stored = await db.models.Scenario.findById(scenario._id).lean();
    expect(find(stored.cohorts, (c) => String(c.cohort) === String(cohort._id))).toBeUndefined();
    expect(find(stored.cohorts, (c) => String(c.cohort) === String(otherCohort))).toBeDefined();
  });

  it('throws 404 when the scenario does not exist', async () => {
    const cohort = await db.models.Cohort.create({ name: 'C' });
    await expect(
      removeScenarioFromCohort(
        { cohortId: cohort._id, update: { scenarioId: new mongoose.Types.ObjectId() } },
        {},
        { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('updates the cohort with updatedBy/updatedAt and returns it', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cohort = await db.models.Cohort.create({ name: 'C' });
    const scenario = await db.models.Scenario.create({
      name: 'S',
      cohorts: [{ cohort: cohort._id, sortOrder: 0 }]
    });

    const result = await removeScenarioFromCohort(
      { cohortId: cohort._id, update: { scenarioId: scenario._id } },
      {},
      { models: db.models, user: { _id: userId } }
    );

    const stored = await db.models.Cohort.findById(cohort._id).lean();
    expect(String(stored.updatedBy)).toBe(String(userId));
    expect(stored.updatedAt).toBeInstanceOf(Date);
    expect(String(result._id)).toBe(String(cohort._id));
  });
});
