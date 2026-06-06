import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { populateRunMock } = vi.hoisted(() => ({ populateRunMock: vi.fn() }));

vi.mock('../helpers/populateRun.js', () => ({ default: (...args) => populateRunMock(...args) }));

import getUsersRunByScenarioId from '../services/getUsersRunByScenarioId.js';

const db = setupMongo();

describe('getUsersRunByScenarioId (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    populateRunMock.mockImplementation(({ run }) => Promise.resolve(run));
  });

  it('creates a Tracking record when none exists for the user+cohort', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const cohortId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    await getUsersRunByScenarioId(
      { scenarioId, cohortId }, {}, { models: db.models, user: { _id: userId } }
    );

    const tracking = await db.models.Tracking.findOne({ cohort: cohortId, user: userId, isDeleted: false }).lean();
    expect(tracking).toBeTruthy();
  });

  it('updates an existing Tracking record instead of creating another', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const cohortId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    await db.models.Tracking.create({ cohort: cohortId, user: userId });

    await getUsersRunByScenarioId(
      { scenarioId, cohortId }, {}, { models: db.models, user: { _id: userId } }
    );

    const trackings = await db.models.Tracking.find({ cohort: cohortId, user: userId, isDeleted: false }).lean();
    expect(trackings).toHaveLength(1);
    expect(String(trackings[0].updatedBy)).toBe(String(userId));
  });

  it('skips tracking when no cohortId is provided', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    await getUsersRunByScenarioId({ scenarioId }, {}, { models: db.models, user: { _id: userId } });

    expect(await db.models.Tracking.countDocuments({})).toBe(0);
  });

  it('creates a new run when none exists for the user+scenario', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const result = await getUsersRunByScenarioId({ scenarioId }, {}, { models: db.models, user: { _id: userId } });

    expect(String(result.scenario)).toBe(String(scenarioId));
    expect(String(result.user)).toBe(String(userId));
    expect(populateRunMock).not.toHaveBeenCalled();
  });

  it('populates an existing non-deleted, non-archived run', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    const run = await db.models.Run.create({ scenario: scenarioId, user: userId });

    const ctx = { models: db.models, user: { _id: userId } };
    const result = await getUsersRunByScenarioId({ scenarioId }, {}, ctx);

    expect(populateRunMock).toHaveBeenCalled();
    expect(String(result._id)).toBe(String(run._id));
  });

  it('ignores archived runs and creates a new one', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    const archived = await db.models.Run.create({ scenario: scenarioId, user: userId, isArchived: true });

    const result = await getUsersRunByScenarioId({ scenarioId }, {}, { models: db.models, user: { _id: userId } });

    expect(String(result._id)).not.toBe(String(archived._id));
    expect(populateRunMock).not.toHaveBeenCalled();
  });
});
