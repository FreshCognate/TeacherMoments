import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  createTriggerMock,
  getTriggerByIdMock,
  deleteTriggerByIdMock,
  updateTriggerByIdMock,
  restoreTriggerByIdMock,
  reorderTriggerMock,
  getTriggersByScenarioIdMock
} = vi.hoisted(() => ({
  createTriggerMock: vi.fn(),
  getTriggerByIdMock: vi.fn(),
  deleteTriggerByIdMock: vi.fn(),
  updateTriggerByIdMock: vi.fn(),
  restoreTriggerByIdMock: vi.fn(),
  reorderTriggerMock: vi.fn(),
  getTriggersByScenarioIdMock: vi.fn()
}));

vi.mock('../services/createTrigger.js', () => ({ default: (...args) => createTriggerMock(...args) }));
vi.mock('../services/getTriggerById.js', () => ({ default: (...args) => getTriggerByIdMock(...args) }));
vi.mock('../services/deleteTriggerById.js', () => ({ default: (...args) => deleteTriggerByIdMock(...args) }));
vi.mock('../services/updateTriggerById.js', () => ({ default: (...args) => updateTriggerByIdMock(...args) }));
vi.mock('../services/restoreTriggerById.js', () => ({ default: (...args) => restoreTriggerByIdMock(...args) }));
vi.mock('../services/reorderTrigger.js', () => ({ default: (...args) => reorderTriggerMock(...args) }));
vi.mock('../services/getTriggersByScenarioId.js', () => ({ default: (...args) => getTriggersByScenarioIdMock(...args) }));

import controller from '../triggers.controller.js';

describe('triggers.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('maps query.scenario → scenarioId and forwards isDeleted', async () => {
      getTriggersByScenarioIdMock.mockResolvedValue({ triggers: [] });

      const result = await controller.all(
        { query: { scenario: 's1', isDeleted: true } },
        { ctx: 1 }
      );

      expect(getTriggersByScenarioIdMock).toHaveBeenCalledWith(
        { scenarioId: 's1' },
        { isDeleted: true },
        { ctx: 1 }
      );
      expect(result).toEqual({ triggers: [] });
    });
  });

  describe('create', () => {
    it('forwards scenario/triggerType/elementRef/action and wraps under "trigger"', async () => {
      createTriggerMock.mockResolvedValue({ _id: 't1' });

      const result = await controller.create(
        { body: { scenario: 's1', triggerType: 'BLOCK', elementRef: 'b1', action: 'SHOW_FEEDBACK_FROM_PROMPTS' } },
        { ctx: 1 }
      );

      expect(createTriggerMock).toHaveBeenCalledWith(
        { scenario: 's1', triggerType: 'BLOCK', elementRef: 'b1', action: 'SHOW_FEEDBACK_FROM_PROMPTS' },
        {},
        { ctx: 1 }
      );
      expect(result).toEqual({ trigger: { _id: 't1' } });
    });
  });

  describe('read', () => {
    it('looks up by URL param and wraps under "trigger"', async () => {
      getTriggerByIdMock.mockResolvedValue({ _id: 't1' });

      const result = await controller.read({ param: 't1' }, { ctx: 1 });

      expect(getTriggerByIdMock).toHaveBeenCalledWith({ triggerId: 't1' }, {}, { ctx: 1 });
      expect(result).toEqual({ trigger: { _id: 't1' } });
    });
  });

  describe('update', () => {
    it('routes to restoreTriggerById when isDeleted is in the body', async () => {
      restoreTriggerByIdMock.mockResolvedValue({ _id: 't1', isDeleted: false });

      const result = await controller.update(
        { param: 't1', body: { isDeleted: false } },
        { ctx: 1 }
      );

      expect(restoreTriggerByIdMock).toHaveBeenCalledWith({ triggerId: 't1' }, {}, { ctx: 1 });
      expect(updateTriggerByIdMock).not.toHaveBeenCalled();
      expect(result).toEqual({ trigger: { _id: 't1', isDeleted: false } });
    });

    it('routes to reorderTrigger when sourceIndex/destinationIndex is in the body', async () => {
      reorderTriggerMock.mockResolvedValue({ _id: 't1' });

      const result = await controller.update(
        { param: 't1', body: { sourceIndex: 0, destinationIndex: 2 } },
        { ctx: 1 }
      );

      expect(reorderTriggerMock).toHaveBeenCalledWith(
        { sourceIndex: 0, destinationIndex: 2, triggerId: 't1' },
        {},
        { ctx: 1 }
      );
      expect(updateTriggerByIdMock).not.toHaveBeenCalled();
      expect(result).toEqual({ trigger: { _id: 't1' } });
    });

    it('routes to updateTriggerById otherwise', async () => {
      updateTriggerByIdMock.mockResolvedValue({ _id: 't1', action: 'X' });

      const result = await controller.update(
        { param: 't1', body: { action: 'X' } },
        { ctx: 1 }
      );

      expect(updateTriggerByIdMock).toHaveBeenCalledWith(
        { triggerId: 't1', update: { action: 'X' } },
        {},
        { ctx: 1 }
      );
      expect(result).toEqual({ trigger: { _id: 't1', action: 'X' } });
    });
  });

  describe('delete', () => {
    it('routes to deleteTriggerById and wraps under "trigger"', async () => {
      deleteTriggerByIdMock.mockResolvedValue({ _id: 't1', isDeleted: true });

      const result = await controller.delete({ param: 't1' }, { ctx: 1 });

      expect(deleteTriggerByIdMock).toHaveBeenCalledWith({ triggerId: 't1' }, {}, { ctx: 1 });
      expect(result).toEqual({ trigger: { _id: 't1', isDeleted: true } });
    });
  });
});
