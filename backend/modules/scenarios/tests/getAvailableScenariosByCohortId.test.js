import { describe, it, expect, vi } from 'vitest';
import getAvailableScenariosByCohortId from '../services/getAvailableScenariosByCohortId.js';

const buildModels = (scenarios = [], count = scenarios.length) => ({
  Scenario: {
    countDocuments: vi.fn().mockResolvedValue(count),
    find: vi.fn(() => ({ sort: vi.fn().mockResolvedValue(scenarios) }))
  }
});

const baseUser = { _id: 'u1' };

describe('getAvailableScenariosByCohortId', () => {
  it('excludes scenarios already linked to the cohort', async () => {
    const models = buildModels();
    await getAvailableScenariosByCohortId({ cohortId: 'c1' }, {}, { models, user: baseUser });
    expect(models.Scenario.countDocuments.mock.calls[0][0]['cohorts.cohort']).toEqual({ $nin: ['c1'] });
  });

  it('only returns published scenarios', async () => {
    const models = buildModels();
    await getAvailableScenariosByCohortId({ cohortId: 'c1' }, {}, { models, user: baseUser });
    expect(models.Scenario.countDocuments.mock.calls[0][0].isPublished).toBe(true);
  });

  it('filters by user collaborator role', async () => {
    const models = buildModels();
    await getAvailableScenariosByCohortId({ cohortId: 'c1' }, {}, { models, user: baseUser });
    const search = models.Scenario.countDocuments.mock.calls[0][0];
    expect(search.collaborators.$elemMatch.user).toBe('u1');
  });

  it('returns scenarios, count, currentPage, totalPages', async () => {
    const models = buildModels([{ _id: 's1' }], 1);
    const result = await getAvailableScenariosByCohortId({ cohortId: 'c1' }, {}, { models, user: baseUser });
    expect(result).toEqual({ scenarios: [{ _id: 's1' }], count: 1, currentPage: 1, totalPages: 1 });
  });
});
