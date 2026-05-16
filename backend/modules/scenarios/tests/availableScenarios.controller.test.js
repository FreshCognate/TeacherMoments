import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getAvailableScenariosByCohortIdMock } = vi.hoisted(() => ({
  getAvailableScenariosByCohortIdMock: vi.fn()
}));

vi.mock('../services/getAvailableScenariosByCohortId.js', () => ({
  default: (...args) => getAvailableScenariosByCohortIdMock(...args)
}));

import controller from '../availableScenarios.controller.js';

describe('availableScenarios.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards cohortId, searchValue, and currentPage', async () => {
    getAvailableScenariosByCohortIdMock.mockResolvedValue({ scenarios: [] });

    await controller.all({
      query: { cohortId: 'c1', searchValue: 'x', currentPage: 2 }
    }, { ctx: 1 });

    expect(getAvailableScenariosByCohortIdMock).toHaveBeenCalledWith(
      { cohortId: 'c1' },
      { searchValue: 'x', currentPage: 2 },
      { ctx: 1 }
    );
  });
});
