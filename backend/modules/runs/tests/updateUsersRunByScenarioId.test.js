import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { populateRunMock } = vi.hoisted(() => ({ populateRunMock: vi.fn() }));

vi.mock('../helpers/populateRun.js', () => ({ default: (...args) => populateRunMock(...args) }));

import updateUsersRunByScenarioId from '../services/updateUsersRunByScenarioId.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

const buildModels = ({ originalRun = {}, updatedRun = {} } = {}) => ({
  Run: {
    findOne: vi.fn().mockResolvedValue(originalRun),
    findOneAndUpdate: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(updatedRun) }))
  }
});

describe('updateUsersRunByScenarioId', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
    populateRunMock.mockImplementation(({ run }) => Promise.resolve(run));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('transition timestamps', () => {
    it('stamps archivedAt when isArchived transitions from false to true', async () => {
      const models = buildModels({ originalRun: { isArchived: false } });

      await updateUsersRunByScenarioId(
        { scenarioId: 's1', update: { isArchived: true } },
        {},
        { models, user: { _id: 'u1' } }
      );

      const updateArg = models.Run.findOneAndUpdate.mock.calls[0][1];
      expect(updateArg.archivedAt).toEqual(FIXED_NOW);
    });

    it('does not stamp archivedAt when the run was already archived', async () => {
      const models = buildModels({ originalRun: { isArchived: true } });

      await updateUsersRunByScenarioId(
        { scenarioId: 's1', update: { isArchived: true } },
        {},
        { models, user: { _id: 'u1' } }
      );

      const updateArg = models.Run.findOneAndUpdate.mock.calls[0][1];
      expect(updateArg.archivedAt).toBeUndefined();
    });

    it('stamps completedAt when isComplete transitions from false to true', async () => {
      const models = buildModels({ originalRun: { isComplete: false } });

      await updateUsersRunByScenarioId(
        { scenarioId: 's1', update: { isComplete: true } },
        {},
        { models, user: { _id: 'u1' } }
      );

      expect(models.Run.findOneAndUpdate.mock.calls[0][1].completedAt).toEqual(FIXED_NOW);
    });

    it('stamps consentAcknowledgedAt when isConsentAcknowledged transitions to true', async () => {
      const models = buildModels({ originalRun: { isConsentAcknowledged: false } });

      await updateUsersRunByScenarioId(
        { scenarioId: 's1', update: { isConsentAcknowledged: true } },
        {},
        { models, user: { _id: 'u1' } }
      );

      expect(models.Run.findOneAndUpdate.mock.calls[0][1].consentAcknowledgedAt).toEqual(FIXED_NOW);
    });

    it('stamps givenConsentAt when hasGivenConsent transitions to true', async () => {
      const models = buildModels({ originalRun: { hasGivenConsent: false } });

      await updateUsersRunByScenarioId(
        { scenarioId: 's1', update: { hasGivenConsent: true } },
        {},
        { models, user: { _id: 'u1' } }
      );

      expect(models.Run.findOneAndUpdate.mock.calls[0][1].givenConsentAt).toEqual(FIXED_NOW);
    });
  });

  describe('stage time calculation', () => {
    it('computes timeSpentMs per stage from startedAt/completedAt and totals across stages', async () => {
      const models = buildModels({ originalRun: {} });

      await updateUsersRunByScenarioId(
        {
          scenarioId: 's1',
          update: {
            stages: [
              { startedAt: '2026-05-07T12:00:00Z', completedAt: '2026-05-07T12:00:05Z' },
              { startedAt: '2026-05-07T12:01:00Z', completedAt: '2026-05-07T12:01:10Z' }
            ]
          }
        },
        {},
        { models, user: { _id: 'u1' } }
      );

      const updateArg = models.Run.findOneAndUpdate.mock.calls[0][1];
      expect(updateArg.stages[0].timeSpentMs).toBe(5000);
      expect(updateArg.stages[1].timeSpentMs).toBe(10000);
      expect(updateArg.totalTimeSpentMs).toBe(15000);
    });

    it('skips stages that are missing startedAt or completedAt', async () => {
      const models = buildModels({ originalRun: {} });

      await updateUsersRunByScenarioId(
        {
          scenarioId: 's1',
          update: {
            stages: [
              { startedAt: '2026-05-07T12:00:00Z', completedAt: '2026-05-07T12:00:05Z' },
              { startedAt: '2026-05-07T12:01:00Z' }
            ]
          }
        },
        {},
        { models, user: { _id: 'u1' } }
      );

      const updateArg = models.Run.findOneAndUpdate.mock.calls[0][1];
      expect(updateArg.stages[0].timeSpentMs).toBe(5000);
      expect(updateArg.stages[1].timeSpentMs).toBeUndefined();
      expect(updateArg.totalTimeSpentMs).toBe(5000);
    });
  });

  describe('audit trail', () => {
    it('stamps updatedAt and updatedBy on every update', async () => {
      const models = buildModels({ originalRun: {} });

      await updateUsersRunByScenarioId(
        { scenarioId: 's1', update: { foo: 'bar' } },
        {},
        { models, user: { _id: 'u1' } }
      );

      const updateArg = models.Run.findOneAndUpdate.mock.calls[0][1];
      expect(updateArg.updatedAt).toEqual(FIXED_NOW);
      expect(updateArg.updatedBy).toBe('u1');
    });
  });

  describe('result', () => {
    it('returns the populated updated run', async () => {
      const updatedRun = { _id: 'r1', stages: [] };
      const models = buildModels({ originalRun: {}, updatedRun });

      const result = await updateUsersRunByScenarioId(
        { scenarioId: 's1', update: {} },
        {},
        { models, user: { _id: 'u1' } }
      );

      expect(populateRunMock).toHaveBeenCalledWith({ run: updatedRun }, expect.any(Object));
      expect(result).toBe(updatedRun);
    });
  });
});
