import { describe, it, expect, vi, beforeEach } from 'vitest';

const { createJobMock, checkScenarioAccessMock, checkCohortViewMock } = vi.hoisted(() => ({
  createJobMock: vi.fn(),
  checkScenarioAccessMock: vi.fn(),
  checkCohortViewMock: vi.fn()
}));

vi.mock('#core/queues/helpers/createJob.js', () => ({ default: (...args) => createJobMock(...args) }));
vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkScenarioAccessMock(...args) }));
vi.mock('../../cohorts/helpers/checkHasAccessToViewCohort.js', () => ({ default: (...args) => checkCohortViewMock(...args) }));

import createExport from '../services/createExport.js';

const buildModels = ({ existingExport = null, createdRecord = { _id: 'export-1' } } = {}) => ({
  Export: {
    findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(existingExport) })),
    create: vi.fn().mockResolvedValue(createdRecord)
  }
});

describe('createExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createJobMock.mockResolvedValue({ id: 'job-1' });
  });

  describe('permissions', () => {
    it.each(['SCENARIO_RESPONSES', 'COHORT_SCENARIO', 'COHORT_USER', 'COHORT_ALL'])(
      'throws 403 for %s when the user is not SUPER_ADMIN/ADMIN/FACILITATOR',
      async (exportType) => {
        const ctx = { models: buildModels(), user: { _id: 'u1', role: 'USER' } };

        await expect(createExport(
          { exportType, scenarioId: 's1', cohortId: 'c1' },
          {},
          ctx
        )).rejects.toMatchObject({ statusCode: 403 });
      }
    );

    it('allows USER_HISTORY for any role', async () => {
      const models = buildModels();
      await createExport(
        { exportType: 'USER_HISTORY' },
        {},
        { models, user: { _id: 'u1', role: 'USER' } }
      );
      expect(models.Export.create).toHaveBeenCalled();
    });
  });

  describe('validation per export type', () => {
    it('throws 400 when SCENARIO_RESPONSES is missing scenarioId', async () => {
      await expect(createExport(
        { exportType: 'SCENARIO_RESPONSES' },
        {},
        { models: buildModels(), user: { _id: 'u1', role: 'ADMIN' } }
      )).rejects.toMatchObject({ statusCode: 400, message: expect.stringContaining('scenarioId') });
    });

    it('throws 400 when COHORT_SCENARIO is missing cohortId or scenarioId', async () => {
      await expect(createExport(
        { exportType: 'COHORT_SCENARIO', cohortId: 'c1' },
        {},
        { models: buildModels(), user: { _id: 'u1', role: 'ADMIN' } }
      )).rejects.toMatchObject({ statusCode: 400 });
    });

    it('throws 400 when COHORT_USER is missing cohortId or userId', async () => {
      await expect(createExport(
        { exportType: 'COHORT_USER', cohortId: 'c1' },
        {},
        { models: buildModels(), user: { _id: 'u1', role: 'ADMIN' } }
      )).rejects.toMatchObject({ statusCode: 400 });
    });

    it('throws 400 when COHORT_ALL is missing cohortId', async () => {
      await expect(createExport(
        { exportType: 'COHORT_ALL' },
        {},
        { models: buildModels(), user: { _id: 'u1', role: 'ADMIN' } }
      )).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('USER_HISTORY', () => {
    it('uses the requesting users id as the resolved userId', async () => {
      const models = buildModels();
      await createExport(
        { exportType: 'USER_HISTORY' },
        {},
        { models, user: { _id: 'user-7', role: 'USER' } }
      );

      expect(models.Export.create).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user-7',
        exportType: 'USER_HISTORY'
      }));
    });
  });

  describe('access checks', () => {
    it('checks scenario access when scenarioId is set', async () => {
      const ctx = { models: buildModels(), user: { _id: 'u1', role: 'ADMIN' } };
      await createExport(
        { exportType: 'SCENARIO_RESPONSES', scenarioId: 's1' },
        {},
        ctx
      );
      expect(checkScenarioAccessMock).toHaveBeenCalledWith({ modelId: 's1', modelType: 'Scenario' }, ctx);
    });

    it('checks cohort view access when cohortId is set', async () => {
      const ctx = { models: buildModels(), user: { _id: 'u1', role: 'ADMIN' } };
      await createExport(
        { exportType: 'COHORT_ALL', cohortId: 'c1' },
        {},
        ctx
      );
      expect(checkCohortViewMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
    });
  });

  describe('dedupe', () => {
    it('throws 409 when an in-progress export already exists', async () => {
      const models = buildModels({ existingExport: { _id: 'existing' } });

      await expect(createExport(
        { exportType: 'USER_HISTORY' },
        {},
        { models, user: { _id: 'u1', role: 'USER' } }
      )).rejects.toMatchObject({ statusCode: 409 });

      expect(models.Export.create).not.toHaveBeenCalled();
    });

    it('queries for in-progress exports filtered by user, type, and PENDING/PROCESSING status', async () => {
      const models = buildModels();
      await createExport(
        { exportType: 'USER_HISTORY' },
        {},
        { models, user: { _id: 'user-7', role: 'USER' } }
      );

      expect(models.Export.findOne).toHaveBeenCalledWith({
        exportType: 'USER_HISTORY',
        scenarioId: undefined,
        cohortId: undefined,
        userId: 'user-7',
        createdBy: 'user-7',
        status: { $in: ['PENDING', 'PROCESSING'] }
      });
    });
  });

  describe('job dispatch', () => {
    it('creates an export record and queues a GENERATE_EXPORT job', async () => {
      const exportRecord = { _id: 'export-9' };
      const models = buildModels({ createdRecord: exportRecord });

      const result = await createExport(
        { exportType: 'SCENARIO_RESPONSES', scenarioId: 's1' },
        {},
        { models, user: { _id: 'u1', role: 'ADMIN' } }
      );

      expect(models.Export.create).toHaveBeenCalledWith({
        exportType: 'SCENARIO_RESPONSES',
        scenarioId: 's1',
        cohortId: undefined,
        userId: undefined,
        status: 'PENDING',
        createdBy: 'u1'
      });

      expect(createJobMock).toHaveBeenCalledWith({
        queue: 'exports',
        name: 'GENERATE_EXPORT',
        job: {
          exportId: 'export-9',
          exportType: 'SCENARIO_RESPONSES',
          scenarioId: 's1',
          cohortId: undefined,
          userId: undefined
        }
      });

      expect(result).toEqual({ export: exportRecord, jobId: 'job-1' });
    });
  });
});
