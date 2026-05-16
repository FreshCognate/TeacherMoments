import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getPublishedSlidesByScenarioIdMock } = vi.hoisted(() => ({
  getPublishedSlidesByScenarioIdMock: vi.fn()
}));

vi.mock('../../slides/services/getPublishedSlidesByScenarioId.js', () => ({
  default: (...args) => getPublishedSlidesByScenarioIdMock(...args)
}));

import controller from '../playSlides.controller.js';

describe('playSlides.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps query.scenario to scenarioId and forwards', async () => {
    getPublishedSlidesByScenarioIdMock.mockResolvedValue({ slides: [] });

    const result = await controller.all({ query: { scenario: 's1' } }, { ctx: 1 });

    expect(getPublishedSlidesByScenarioIdMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, { ctx: 1 });
    expect(result).toEqual({ slides: [] });
  });
});
