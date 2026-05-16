import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkCohortEditMock } = vi.hoisted(() => ({ checkCohortEditMock: vi.fn() }));

vi.mock('../../cohorts/helpers/checkHasAccessToEditCohort.js', () => ({
  default: (...args) => checkCohortEditMock(...args)
}));

import sortCohortScenarios from '../services/sortCohortScenarios.js';

describe('sortCohortScenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks cohort edit access', async () => {
    const findOneAndUpdate = vi.fn().mockResolvedValue({});
    const ctx = { models: { Scenario: { findOneAndUpdate } } };

    await sortCohortScenarios({ cohortId: 'c1', scenarios: [] }, {}, ctx);

    expect(checkCohortEditMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('updates the per-cohort sortOrder for each scenario using arrayFilters', async () => {
    const findOneAndUpdate = vi.fn().mockResolvedValue({});

    await sortCohortScenarios(
      {
        cohortId: 'c1',
        scenarios: [
          { _id: 's1', sortOrder: 0 },
          { _id: 's2', sortOrder: 1 }
        ]
      },
      {},
      { models: { Scenario: { findOneAndUpdate } } }
    );

    expect(findOneAndUpdate).toHaveBeenCalledTimes(2);
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 's1' },
      { $set: { 'cohorts.$[item].sortOrder': 0 } },
      { arrayFilters: [{ 'item.cohort': 'c1' }] }
    );
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 's2' },
      { $set: { 'cohorts.$[item].sortOrder': 1 } },
      { arrayFilters: [{ 'item.cohort': 'c1' }] }
    );
  });

  it('returns an empty object', async () => {
    const findOneAndUpdate = vi.fn().mockResolvedValue({});

    const result = await sortCohortScenarios(
      { cohortId: 'c1', scenarios: [] },
      {},
      { models: { Scenario: { findOneAndUpdate } } }
    );

    expect(result).toEqual({});
  });
});
