import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { populateRunMock } = vi.hoisted(() => ({ populateRunMock: vi.fn() }));

vi.mock('../helpers/populateRun.js', () => ({ default: (...args) => populateRunMock(...args) }));

import getUsersRunByScenarioId from '../services/getUsersRunByScenarioId.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

describe('getUsersRunByScenarioId', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
    populateRunMock.mockImplementation(({ run }) => Promise.resolve(run));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('cohort tracking', () => {
    it('creates a Tracking record when no tracking exists for the user+cohort', async () => {
      const Tracking = {
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({})
      };
      const Run = {
        findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue({ _id: 'run-1', stages: [] }) })),
        create: vi.fn()
      };

      await getUsersRunByScenarioId(
        { scenarioId: 's1', cohortId: 'c1' },
        {},
        { models: { Tracking, Run }, user: { _id: 'u1' } }
      );

      expect(Tracking.findOne).toHaveBeenCalledWith({ cohort: 'c1', user: 'u1', isDeleted: false });
      expect(Tracking.create).toHaveBeenCalledWith({
        cohort: 'c1',
        user: 'u1',
        createdAt: FIXED_NOW,
        createdBy: 'u1'
      });
    });

    it('updates an existing Tracking record with updatedAt and updatedBy', async () => {
      const tracking = { save: vi.fn().mockResolvedValue() };
      const Tracking = { findOne: vi.fn().mockResolvedValue(tracking), create: vi.fn() };
      const Run = {
        findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue({ _id: 'run-1', stages: [] }) })),
        create: vi.fn()
      };

      await getUsersRunByScenarioId(
        { scenarioId: 's1', cohortId: 'c1' },
        {},
        { models: { Tracking, Run }, user: { _id: 'u1' } }
      );

      expect(tracking.updatedAt).toEqual(FIXED_NOW);
      expect(tracking.updatedBy).toBe('u1');
      expect(tracking.save).toHaveBeenCalled();
      expect(Tracking.create).not.toHaveBeenCalled();
    });

    it('skips tracking when no cohortId is provided', async () => {
      const Tracking = { findOne: vi.fn(), create: vi.fn() };
      const Run = {
        findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue({ _id: 'run-1', stages: [] }) })),
        create: vi.fn()
      };

      await getUsersRunByScenarioId(
        { scenarioId: 's1' },
        {},
        { models: { Tracking, Run }, user: { _id: 'u1' } }
      );

      expect(Tracking.findOne).not.toHaveBeenCalled();
    });
  });

  describe('run lookup', () => {
    it('creates a new run when none exists for the user+scenario', async () => {
      const Run = {
        findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(null) })),
        create: vi.fn().mockResolvedValue({ _id: 'new-run' })
      };

      const result = await getUsersRunByScenarioId(
        { scenarioId: 's1' },
        {},
        { models: { Run }, user: { _id: 'u1' } }
      );

      expect(Run.create).toHaveBeenCalledWith({
        scenario: 's1',
        user: 'u1',
        createdAt: FIXED_NOW,
        createdBy: 'u1'
      });
      expect(result).toEqual({ _id: 'new-run' });
      expect(populateRunMock).not.toHaveBeenCalled();
    });

    it('populates an existing run', async () => {
      const existingRun = { _id: 'existing-run', stages: [] };
      const Run = {
        findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(existingRun) })),
        create: vi.fn()
      };

      const ctx = { models: { Run }, user: { _id: 'u1' } };
      const result = await getUsersRunByScenarioId({ scenarioId: 's1' }, {}, ctx);

      expect(populateRunMock).toHaveBeenCalledWith({ run: existingRun }, ctx);
      expect(Run.create).not.toHaveBeenCalled();
      expect(result).toBe(existingRun);
    });

    it('searches for non-deleted, non-archived runs only', async () => {
      const Run = {
        findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(null) })),
        create: vi.fn().mockResolvedValue({})
      };

      await getUsersRunByScenarioId({ scenarioId: 's1' }, {}, { models: { Run }, user: { _id: 'u1' } });

      expect(Run.findOne).toHaveBeenCalledWith({
        scenario: 's1',
        user: 'u1',
        isDeleted: false,
        isArchived: false
      });
    });
  });
});
