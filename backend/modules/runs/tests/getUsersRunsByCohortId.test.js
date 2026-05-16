import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkCohortViewMock } = vi.hoisted(() => ({ checkCohortViewMock: vi.fn() }));

vi.mock('../../cohorts/helpers/checkHasAccessToViewCohort.js', () => ({
  default: (...args) => checkCohortViewMock(...args)
}));

import getUsersRunsByCohortId from '../services/getUsersRunsByCohortId.js';

describe('getUsersRunsByCohortId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks cohort view access', async () => {
    const ctx = {
      models: {
        Scenario: { find: vi.fn().mockResolvedValue([]) },
        Run: { find: vi.fn().mockResolvedValue([]) }
      },
      user: { _id: 'u1' }
    };

    await getUsersRunsByCohortId({ cohortId: 'c1' }, {}, ctx);

    expect(checkCohortViewMock).toHaveBeenCalledWith({ cohortId: 'c1' }, ctx);
  });

  it('finds non-deleted scenarios in the cohort and runs for those scenarios scoped to the user', async () => {
    const Scenario = {
      find: vi.fn().mockResolvedValue([{ _id: 's1' }, { _id: 's2' }])
    };
    const Run = {
      find: vi.fn().mockResolvedValue([{ _id: 'r1' }])
    };

    const result = await getUsersRunsByCohortId(
      { cohortId: 'c1' },
      {},
      { models: { Scenario, Run }, user: { _id: 'u1' } }
    );

    expect(Scenario.find).toHaveBeenCalledWith({ 'cohorts.cohort': 'c1', isDeleted: false });
    expect(Run.find).toHaveBeenCalledWith({
      scenario: { $in: ['s1', 's2'] },
      user: 'u1',
      isDeleted: false
    });
    expect(result).toEqual({ runs: [{ _id: 'r1' }] });
  });

  it('returns an empty runs list when the cohort has no scenarios', async () => {
    const Scenario = { find: vi.fn().mockResolvedValue([]) };
    const Run = { find: vi.fn().mockResolvedValue([]) };

    const result = await getUsersRunsByCohortId(
      { cohortId: 'c1' },
      {},
      { models: { Scenario, Run }, user: { _id: 'u1' } }
    );

    expect(result).toEqual({ runs: [] });
  });
});
