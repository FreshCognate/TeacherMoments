import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { populateRunMock } = vi.hoisted(() => ({ populateRunMock: vi.fn() }));

vi.mock('../helpers/populateRun.js', () => ({ default: (...args) => populateRunMock(...args) }));

import updateUsersRunByScenarioId from '../services/updateUsersRunByScenarioId.js';

const db = setupMongo();

const seedRun = (overrides = {}) => {
  const scenario = new mongoose.Types.ObjectId();
  const user = new mongoose.Types.ObjectId();
  return db.models.Run.create({ scenario, user, ...overrides }).then((run) => ({ run, scenario, user }));
};

describe('updateUsersRunByScenarioId (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    populateRunMock.mockImplementation(({ run }) => Promise.resolve(run));
  });

  it('stamps archivedAt when isArchived transitions from false to true', async () => {
    const { run, scenario, user } = await seedRun({ isArchived: false });

    await updateUsersRunByScenarioId(
      { scenarioId: scenario, update: { isArchived: true } }, {}, { models: db.models, user: { _id: user } }
    );

    const stored = await db.models.Run.findById(run._id).lean();
    expect(stored.isArchived).toBe(true);
    expect(stored.archivedAt).toBeInstanceOf(Date);
  });

  it('stamps completedAt when isComplete transitions to true', async () => {
    const { run, scenario, user } = await seedRun({ isComplete: false });

    await updateUsersRunByScenarioId(
      { scenarioId: scenario, update: { isComplete: true } }, {}, { models: db.models, user: { _id: user } }
    );

    const stored = await db.models.Run.findById(run._id).lean();
    expect(stored.completedAt).toBeInstanceOf(Date);
  });

  it('computes timeSpentMs per stage and totals across stages', async () => {
    const { run, scenario, user } = await seedRun({});

    await updateUsersRunByScenarioId(
      {
        scenarioId: scenario,
        update: {
          stages: [
            { slideRef: 'a', startedAt: '2026-05-07T12:00:00Z', completedAt: '2026-05-07T12:00:05Z' },
            { slideRef: 'b', startedAt: '2026-05-07T12:01:00Z', completedAt: '2026-05-07T12:01:10Z' }
          ]
        }
      },
      {},
      { models: db.models, user: { _id: user } }
    );

    const stored = await db.models.Run.findById(run._id).lean();
    expect(stored.stages[0].timeSpentMs).toBe(5000);
    expect(stored.stages[1].timeSpentMs).toBe(10000);
    expect(stored.totalTimeSpentMs).toBe(15000);
  });

  it('stamps updatedAt and updatedBy on every update', async () => {
    const { run, scenario, user } = await seedRun({});

    await updateUsersRunByScenarioId(
      { scenarioId: scenario, update: { activeSlideRef: 'slide-x' } }, {}, { models: db.models, user: { _id: user } }
    );

    const stored = await db.models.Run.findById(run._id).lean();
    expect(stored.updatedAt).toBeInstanceOf(Date);
    expect(String(stored.updatedBy)).toBe(String(user));
  });

  it('returns the populated updated run', async () => {
    const { scenario, user } = await seedRun({});

    const result = await updateUsersRunByScenarioId(
      { scenarioId: scenario, update: {} }, {}, { models: db.models, user: { _id: user } }
    );

    expect(populateRunMock).toHaveBeenCalled();
    expect(String(result.scenario)).toBe(String(scenario));
  });
});
