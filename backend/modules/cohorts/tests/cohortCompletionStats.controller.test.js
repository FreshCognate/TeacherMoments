import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getStatsMock } = vi.hoisted(() => ({ getStatsMock: vi.fn() }));

vi.mock('../services/getCohortCompletionStatsByCohortId.js', () => ({
  default: (...args) => getStatsMock(...args)
}));

import controller from '../cohortCompletionStats.controller.js';

describe('cohortCompletionStats.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the cohortId from query and returns the stats', async () => {
    getStatsMock.mockResolvedValue({ totalUsers: 5, scenarioCompletions: [], cohortCompletionCount: 0 });

    const result = await controller.all({ query: { cohortId: 'c1' } }, { ctx: 1 });

    expect(getStatsMock).toHaveBeenCalledWith({ cohortId: 'c1' }, {}, { ctx: 1 });
    expect(result).toEqual({ totalUsers: 5, scenarioCompletions: [], cohortCompletionCount: 0 });
  });
});
