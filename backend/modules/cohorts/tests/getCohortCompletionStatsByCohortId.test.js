import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock, objectIdFromHexMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  objectIdFromHexMock: vi.fn((id) => `oid:${id}`)
}));

vi.mock('../helpers/checkHasAccessToViewCohort.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));

vi.mock('mongoose', () => ({
  default: {
    Types: {
      ObjectId: { createFromHexString: (...args) => objectIdFromHexMock(...args) }
    }
  }
}));

import getCohortCompletionStatsByCohortId from '../services/getCohortCompletionStatsByCohortId.js';

const buildModels = ({ scenarios = [], totalUsers = 0, completionAggregation = [] }) => {
  const Scenario = {
    find: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(scenarios) }))
  };
  return {
    Scenario,
    User: { countDocuments: vi.fn().mockResolvedValue(totalUsers) },
    Run: { aggregate: vi.fn().mockResolvedValue(completionAggregation) }
  };
};

describe('getCohortCompletionStatsByCohortId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns zero stats when the cohort has no scenarios', async () => {
    const models = buildModels({ scenarios: [], totalUsers: 5 });
    const result = await getCohortCompletionStatsByCohortId(
      { cohortId: 'c1' },
      {},
      { models }
    );
    expect(result).toEqual({ totalUsers: 5, scenarioCompletions: [], cohortCompletionCount: 0 });
    expect(models.Run.aggregate).not.toHaveBeenCalled();
  });

  it('returns per-scenario completions and a cohort-wide count when all users completed everything', async () => {
    const models = buildModels({
      scenarios: [{ _id: 's1' }, { _id: 's2' }],
      totalUsers: 3,
      completionAggregation: [
        { _id: 's1', completedUsers: ['u1', 'u2', 'u3'], completedCount: 3 },
        { _id: 's2', completedUsers: ['u1', 'u2'], completedCount: 2 }
      ]
    });

    const result = await getCohortCompletionStatsByCohortId(
      { cohortId: 'c1' },
      {},
      { models }
    );

    expect(result.scenarioCompletions).toEqual([
      { scenarioId: 's1', completedCount: 3 },
      { scenarioId: 's2', completedCount: 2 }
    ]);

    // u1 and u2 completed both scenarios
    expect(result.cohortCompletionCount).toBe(2);
  });

  it('returns cohortCompletionCount=0 when not every scenario has completion data', async () => {
    const models = buildModels({
      scenarios: [{ _id: 's1' }, { _id: 's2' }],
      totalUsers: 3,
      completionAggregation: [
        { _id: 's1', completedUsers: ['u1', 'u2', 'u3'], completedCount: 3 }
      ]
    });

    const result = await getCohortCompletionStatsByCohortId(
      { cohortId: 'c1' },
      {},
      { models }
    );

    expect(result.cohortCompletionCount).toBe(0);
  });
});
