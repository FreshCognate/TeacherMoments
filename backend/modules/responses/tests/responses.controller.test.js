import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getUsersResponsesByCohortAndScenarioMock,
  getUsersResponsesByScenarioMock,
  getUserResponsesByCohortScenariosMock
} = vi.hoisted(() => ({
  getUsersResponsesByCohortAndScenarioMock: vi.fn(),
  getUsersResponsesByScenarioMock: vi.fn(),
  getUserResponsesByCohortScenariosMock: vi.fn()
}));

vi.mock('../services/getUsersResponsesByCohortAndScenario.js', () => ({ default: (...args) => getUsersResponsesByCohortAndScenarioMock(...args) }));
vi.mock('../services/getUsersResponsesByScenario.js', () => ({ default: (...args) => getUsersResponsesByScenarioMock(...args) }));
vi.mock('../services/getUserResponsesByCohortScenarios.js', () => ({ default: (...args) => getUserResponsesByCohortScenariosMock(...args) }));

import controller from '../responses.controller.js';

describe('responses.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes to getUserResponsesByCohortScenarios when both userId and cohortId are present', async () => {
    getUserResponsesByCohortScenariosMock.mockResolvedValue({ responses: [] });

    await controller.all({
      query: { userId: 'u1', cohortId: 'c1', searchValue: 'x', currentPage: 2 }
    }, { ctx: 1 });

    expect(getUserResponsesByCohortScenariosMock).toHaveBeenCalledWith(
      { userId: 'u1', cohortId: 'c1' },
      { searchValue: 'x', currentPage: 2 },
      { ctx: 1 }
    );
    expect(getUsersResponsesByCohortAndScenarioMock).not.toHaveBeenCalled();
  });

  it('routes to getUsersResponsesByCohortAndScenario when cohortId+scenarioId (no userId) are present', async () => {
    getUsersResponsesByCohortAndScenarioMock.mockResolvedValue({ responses: [] });

    await controller.all({
      query: { cohortId: 'c1', scenarioId: 's1' }
    }, { ctx: 1 });

    expect(getUsersResponsesByCohortAndScenarioMock).toHaveBeenCalledWith(
      { cohortId: 'c1', scenarioId: 's1' },
      { searchValue: undefined, currentPage: undefined },
      { ctx: 1 }
    );
  });

  it('routes to getUsersResponsesByScenario when only scenarioId is present', async () => {
    getUsersResponsesByScenarioMock.mockResolvedValue({ responses: [] });

    await controller.all({ query: { scenarioId: 's1' } }, { ctx: 1 });

    expect(getUsersResponsesByScenarioMock).toHaveBeenCalledWith(
      { scenarioId: 's1' },
      { searchValue: undefined, currentPage: undefined },
      { ctx: 1 }
    );
  });

  it('returns an empty responses array when no recognised filter is present', async () => {
    const result = await controller.all({ query: {} }, {});
    expect(result).toEqual({ responses: [] });
  });
});
