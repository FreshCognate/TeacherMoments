import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getPublishedBlocksByScenarioIdMock } = vi.hoisted(() => ({
  getPublishedBlocksByScenarioIdMock: vi.fn()
}));

vi.mock('../../blocks/services/getPublishedBlocksByScenarioId.js', () => ({
  default: (...args) => getPublishedBlocksByScenarioIdMock(...args)
}));

import controller from '../playBlocks.controller.js';

describe('playBlocks.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps query.scenario to scenarioId and forwards', async () => {
    getPublishedBlocksByScenarioIdMock.mockResolvedValue({ blocks: [] });

    const result = await controller.all({ query: { scenario: 's1' } }, { ctx: 1 });

    expect(getPublishedBlocksByScenarioIdMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, { ctx: 1 });
    expect(result).toEqual({ blocks: [] });
  });
});
