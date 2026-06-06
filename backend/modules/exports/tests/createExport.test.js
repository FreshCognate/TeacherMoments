import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { createJobMock, checkScenarioAccessMock, checkCohortViewMock } = vi.hoisted(() => ({
  createJobMock: vi.fn(),
  checkScenarioAccessMock: vi.fn(),
  checkCohortViewMock: vi.fn()
}));

vi.mock('#core/queues/helpers/createJob.js', () => ({ default: (...args) => createJobMock(...args) }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkScenarioAccessMock(...args) }));
vi.mock('../../cohorts/helpers/checkHasAccessToViewCohort.js', () => ({ default: (...args) => checkCohortViewMock(...args) }));

import createExport from '../services/createExport.js';

const db = setupMongo();

describe('createExport (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createJobMock.mockResolvedValue({ id: 'job-1' });
    checkScenarioAccessMock.mockResolvedValue();
    checkCohortViewMock.mockResolvedValue();
  });

  it.each(['SCENARIO_RESPONSES', 'COHORT_SCENARIO', 'COHORT_USER', 'COHORT_ALL'])(
    'throws 403 for %s when the user is a plain USER',
    async (exportType) => {
      await expect(
        createExport({ exportType, scenarioId: new mongoose.Types.ObjectId(), cohortId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId(), role: 'USER' } })
      ).rejects.toMatchObject({ statusCode: 403 });
    }
  );

  it('throws 400 when SCENARIO_RESPONSES is missing scenarioId', async () => {
    await expect(
      createExport({ exportType: 'SCENARIO_RESPONSES' }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId(), role: 'ADMIN' } })
    ).rejects.toMatchObject({ statusCode: 400, message: expect.stringContaining('scenarioId') });
  });

  it('uses the requesting user id as the resolved userId for USER_HISTORY', async () => {
    const userId = new mongoose.Types.ObjectId();
    const result = await createExport({ exportType: 'USER_HISTORY' }, {}, { models: db.models, user: { _id: userId, role: 'USER' } });

    const stored = await db.models.Export.findById(result.export._id).lean();
    expect(stored.exportType).toBe('USER_HISTORY');
    expect(String(stored.userId)).toBe(String(userId));
  });

  it('checks scenario access when scenarioId is set', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId(), role: 'ADMIN' } };
    await createExport({ exportType: 'SCENARIO_RESPONSES', scenarioId }, {}, ctx);
    expect(checkScenarioAccessMock).toHaveBeenCalledWith({ modelId: scenarioId, modelType: 'Scenario' }, ctx);
  });

  it('throws 409 when an in-progress export already exists for the same user and type', async () => {
    const user = { _id: new mongoose.Types.ObjectId(), role: 'USER' };
    await createExport({ exportType: 'USER_HISTORY' }, {}, { models: db.models, user });

    await expect(
      createExport({ exportType: 'USER_HISTORY' }, {}, { models: db.models, user })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('creates a PENDING export record and queues a GENERATE_EXPORT job', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const result = await createExport(
      { exportType: 'SCENARIO_RESPONSES', scenarioId }, {}, { models: db.models, user: { _id: userId, role: 'ADMIN' } }
    );

    const stored = await db.models.Export.findById(result.export._id).lean();
    expect(stored.status).toBe('PENDING');
    expect(String(stored.createdBy)).toBe(String(userId));

    expect(createJobMock).toHaveBeenCalledWith(expect.objectContaining({
      queue: 'exports',
      name: 'GENERATE_EXPORT',
      job: expect.objectContaining({ exportId: String(result.export._id), exportType: 'SCENARIO_RESPONSES' })
    }));
    expect(result.jobId).toBe('job-1');
  });
});
