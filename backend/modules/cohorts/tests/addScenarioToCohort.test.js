import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { checkAccessMock, getScenariosCountByCohortIdMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  getScenariosCountByCohortIdMock: vi.fn()
}));

vi.mock('../helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

vi.mock('../../scenarios/services/getScenariosCountByCohortId.js', () => ({
  default: (...args) => getScenariosCountByCohortIdMock(...args)
}));

import addScenarioToCohort from '../services/addScenarioToCohort.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildModels = (scenario, cohort) => ({
  Scenario: { findOneAndUpdate: vi.fn().mockResolvedValue(scenario) },
  Cohort: {
    findByIdAndUpdate: vi.fn(() => ({
      populate: vi.fn().mockResolvedValue(cohort)
    }))
  }
});

describe('addScenarioToCohort', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
    getScenariosCountByCohortIdMock.mockResolvedValue({ count: 3 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('checks edit access', async () => {
    const models = buildModels({ _id: 's1' }, { _id: 'c1' });
    const ctx = { models, user: { _id: 'u1' } };
    await addScenarioToCohort({ cohortId: 'c1', update: { scenarioId: 's1' } }, {}, ctx);
    expect(checkAccessMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('pushes the cohort onto the scenario with the next sortOrder', async () => {
    const models = buildModels({ _id: 's1' }, { _id: 'c1' });
    await addScenarioToCohort(
      { cohortId: 'c1', update: { scenarioId: 's1' } },
      {},
      { models, user: { _id: 'u1' } }
    );

    expect(models.Scenario.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 's1', 'cohorts.cohort': { $ne: 'c1' } },
      {
        $push: {
          cohorts: {
            cohort: 'c1',
            sortOrder: 3,
            addedBy: 'u1',
            addedAt: FIXED_NOW
          }
        }
      },
      { new: true }
    );
  });

  it('throws 404 when the scenario is not found or already linked', async () => {
    const models = buildModels(null, { _id: 'c1' });
    await expect(addScenarioToCohort(
      { cohortId: 'c1', update: { scenarioId: 'missing' } },
      {},
      { models, user: { _id: 'u1' } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });

  it('updates the cohort with updatedBy/updatedAt and returns it', async () => {
    const cohort = { _id: 'c1' };
    const models = buildModels({ _id: 's1' }, cohort);
    const result = await addScenarioToCohort(
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
