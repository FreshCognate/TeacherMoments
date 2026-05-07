import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getUserResponsesByUserScenariosMock } = vi.hoisted(() => ({
  getUserResponsesByUserScenariosMock: vi.fn()
}));

vi.mock('../services/getUserResponsesByUserScenarios.js', () => ({
  default: (...args) => getUserResponsesByUserScenariosMock(...args)
}));

import controller from '../history.controller.js';

describe('history.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards searchValue and currentPage as options', async () => {
    getUserResponsesByUserScenariosMock.mockResolvedValue({ responses: [] });

    await controller.all({ query: { searchValue: 'x', currentPage: 2 } }, { ctx: 1 });

    expect(getUserResponsesByUserScenariosMock).toHaveBeenCalledWith(
      {},
      { searchValue: 'x', currentPage: 2 },
      { ctx: 1 }
    );
  });
});
