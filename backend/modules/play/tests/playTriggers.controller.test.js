import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getPublishedTriggersByScenarioIdMock } = vi.hoisted(() => ({
  getPublishedTriggersByScenarioIdMock: vi.fn()
}));

vi.mock('../../triggers/services/getPublishedTriggersByScenarioId.js', () => ({
  default: (...args) => getPublishedTriggersByScenarioIdMock(...args)
}));

import controller from '../playTriggers.controller.js';

describe('playTriggers.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps query.scenario to scenarioId and forwards', async () => {
    getPublishedTriggersByScenarioIdMock.mockResolvedValue({ triggers: [] });

    const result = await controller.all({ query: { scenario: 's1' } }, { ctx: 1 });

    expect(getPublishedTriggersByScenarioIdMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, { ctx: 1 });
    expect(result).toEqual({ triggers: [] });
  });
});
