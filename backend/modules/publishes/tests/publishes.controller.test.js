import { describe, it, expect, vi, beforeEach } from 'vitest';

const { publishScenarioByIdMock, unpublishScenarioByIdMock } = vi.hoisted(() => ({
  publishScenarioByIdMock: vi.fn(),
  unpublishScenarioByIdMock: vi.fn()
}));

vi.mock('../services/publishScenarioById.js', () => ({ default: (...args) => publishScenarioByIdMock(...args) }));
vi.mock('../services/unpublishScenarioById.js', () => ({ default: (...args) => unpublishScenarioByIdMock(...args) }));

import controller from '../publishes.controller.js';

describe('publishes.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('publishes the scenario from body.scenarioId and wraps under "scenario"', async () => {
      publishScenarioByIdMock.mockResolvedValue({ _id: 's1', isPublished: true });

      const result = await controller.create({ body: { scenarioId: 's1' } }, { ctx: 1 });

      expect(publishScenarioByIdMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, { ctx: 1 });
      expect(result).toEqual({ scenario: { _id: 's1', isPublished: true } });
    });
  });

  describe('delete', () => {
    it('unpublishes the scenario from URL param', async () => {
      unpublishScenarioByIdMock.mockResolvedValue({ _id: 's1', isPublished: false });

      const result = await controller.delete({ param: 's1' }, { ctx: 1 });

      expect(unpublishScenarioByIdMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, { ctx: 1 });
      expect(result).toEqual({ scenario: { _id: 's1', isPublished: false } });
    });
  });
});
