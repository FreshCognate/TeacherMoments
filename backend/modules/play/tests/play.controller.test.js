import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getScenarioByPublishLinkMock } = vi.hoisted(() => ({
  getScenarioByPublishLinkMock: vi.fn()
}));

vi.mock('../../scenarios/services/getScenarioByPublishLink.js', () => ({
  default: (...args) => getScenarioByPublishLinkMock(...args)
}));

import controller from '../play.controller.js';

describe('play.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('looks up the scenario by URL param treated as the publish link', async () => {
    getScenarioByPublishLinkMock.mockResolvedValue({ _id: 's1' });

    const result = await controller.read({ param: 'happy-fox-42' }, { ctx: 1 });

    expect(getScenarioByPublishLinkMock).toHaveBeenCalledWith({ publishLink: 'happy-fox-42' }, {}, { ctx: 1 });
    expect(result).toEqual({ scenario: { _id: 's1' } });
  });
});
