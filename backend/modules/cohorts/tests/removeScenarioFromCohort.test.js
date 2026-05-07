import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

import removeScenarioFromCohort from '../services/removeScenarioFromCohort.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildModels = (scenario, cohort) => ({
  Scenario: { findByIdAndUpdate: vi.fn().mockResolvedValue(scenario) },
  Cohort: {
    findByIdAndUpdate: vi.fn(() => ({
      populate: vi.fn().mockResolvedValue(cohort)
    }))
  }
});

describe('removeScenarioFromCohort', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('pulls the cohort from the scenario.cohorts list', async () => {
    const models = buildModels({ _id: 's1' }, { _id: 'c1' });
    await removeScenarioFromCohort(
      { cohortId: 'c1', update: { scenarioId: 's1' } },
      {},
      { models, user: { _id: 'u1' } }
    );

    expect(models.Scenario.findByIdAndUpdate).toHaveBeenCalledWith(
      's1',
      { $pull: { cohorts: { cohort: 'c1' } } },
      { new: true }
    );
  });

  it('throws 404 when the scenario does not exist', async () => {
    const models = buildModels(null, { _id: 'c1' });
    await expect(removeScenarioFromCohort(
      { cohortId: 'c1', update: { scenarioId: 'missing' } },
      {},
      { models, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });

  it('updates the cohort with updatedBy/updatedAt and returns it', async () => {
    const cohort = { _id: 'c1' };
    const models = buildModels({ _id: 's1' }, cohort);
    const result = await removeScenarioFromCohort(
      { cohortId: 'c1', update: { scenarioId: 's1' } },
      {},
      { models, user: { _id: 'u1' } }
    );

    expect(models.Cohort.findByIdAndUpdate).toHaveBeenCalledWith('c1', {
      updatedBy: 'u1',
      updatedAt: FIXED_NOW
    }, { new: true });
    expect(result).toBe(cohort);
  });
});
