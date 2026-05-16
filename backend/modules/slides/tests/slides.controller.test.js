import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getSlidesByScenarioIdMock,
  getSlideByIdMock,
  restoreSlideByIdMock,
  updateSlideByIdMock,
  deleteSlideByIdMock,
  createSlideMock,
  moveSlideInScenarioMock,
  duplicateSlideInScenarioMock,
  lockSlideMock,
  unlockSlideMock
} = vi.hoisted(() => ({
  getSlidesByScenarioIdMock: vi.fn(),
  getSlideByIdMock: vi.fn(),
  restoreSlideByIdMock: vi.fn(),
  updateSlideByIdMock: vi.fn(),
  deleteSlideByIdMock: vi.fn(),
  createSlideMock: vi.fn(),
  moveSlideInScenarioMock: vi.fn(),
  duplicateSlideInScenarioMock: vi.fn(),
  lockSlideMock: vi.fn(),
  unlockSlideMock: vi.fn()
}));

vi.mock('../services/getSlidesByScenarioId.js', () => ({ default: (...args) => getSlidesByScenarioIdMock(...args) }));
vi.mock('../services/getSlideById.js', () => ({ default: (...args) => getSlideByIdMock(...args) }));
vi.mock('../services/restoreSlideById.js', () => ({ default: (...args) => restoreSlideByIdMock(...args) }));
vi.mock('../services/updateSlideById.js', () => ({ default: (...args) => updateSlideByIdMock(...args) }));
vi.mock('../services/deleteSlideById.js', () => ({ default: (...args) => deleteSlideByIdMock(...args) }));
vi.mock('../services/createSlide.js', () => ({ default: (...args) => createSlideMock(...args) }));
vi.mock('../services/moveSlideInScenario.js', () => ({ default: (...args) => moveSlideInScenarioMock(...args) }));
vi.mock('../services/duplicateSlideInScenario.js', () => ({ default: (...args) => duplicateSlideInScenarioMock(...args) }));
vi.mock('../services/lockSlide.js', () => ({ default: (...args) => lockSlideMock(...args) }));
vi.mock('../services/unlockSlide.js', () => ({ default: (...args) => unlockSlideMock(...args) }));

import controller from '../slides.controller.js';

describe('slides.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('forwards scenarioId and isDeleted to getSlidesByScenarioId', async () => {
      getSlidesByScenarioIdMock.mockResolvedValue({ slides: [] });

      const result = await controller.all(
        { query: { scenarioId: 's1', isDeleted: true } },
        { ctx: 1 }
      );

      expect(getSlidesByScenarioIdMock).toHaveBeenCalledWith(
        { scenarioId: 's1' },
        { isDeleted: true },
        { ctx: 1 }
      );
      expect(result).toEqual({ slides: [] });
    });
  });

  describe('create', () => {
    it('creates a new slide when no slideId is supplied', async () => {
      createSlideMock.mockResolvedValue({ _id: 'newSlide' });

      const result = await controller.create(
        { body: { scenarioId: 's1', sortOrder: 2, stemRef: 'st1' } },
        { ctx: 1 }
      );

      expect(createSlideMock).toHaveBeenCalledWith(
        { scenario: 's1', sortOrder: 2, stemRef: 'st1' },
        {},
        { ctx: 1 }
      );
      expect(duplicateSlideInScenarioMock).not.toHaveBeenCalled();
      expect(result).toEqual({ slide: { _id: 'newSlide' } });
    });

    it('duplicates an existing slide when slideId is supplied', async () => {
      duplicateSlideInScenarioMock.mockResolvedValue({ _id: 'dupSlide' });

      const result = await controller.create(
        { body: { scenarioId: 's1', slideId: 'srcSlide', stemRef: 'st1' } },
        { ctx: 1 }
      );

      expect(duplicateSlideInScenarioMock).toHaveBeenCalledWith(
        { scenario: 's1', slideId: 'srcSlide', stemRef: 'st1' },
        { ctx: 1 }
      );
      expect(createSlideMock).not.toHaveBeenCalled();
      expect(result).toEqual({ slide: { _id: 'dupSlide' } });
    });
  });

  describe('read', () => {
    it('looks up by URL param and wraps under "slide"', async () => {
      getSlideByIdMock.mockResolvedValue({ _id: 'sl1' });

      const result = await controller.read({ param: 'sl1' }, { ctx: 1 });

      expect(getSlideByIdMock).toHaveBeenCalledWith({ slideId: 'sl1' }, {}, { ctx: 1 });
      expect(result).toEqual({ slide: { _id: 'sl1' } });
    });
  });

  describe('update', () => {
    it('routes to moveSlideInScenario when sourceIndex is in the body', async () => {
      moveSlideInScenarioMock.mockResolvedValue({ _id: 'sl1' });

      const result = await controller.update(
        { param: 'sl1', body: { scenarioId: 's1', sourceIndex: 0, destinationIndex: 2 } },
        { ctx: 1 }
      );

      expect(moveSlideInScenarioMock).toHaveBeenCalledWith(
        { scenario: 's1', slideId: 'sl1', sourceIndex: 0, destinationIndex: 2 },
        { ctx: 1 }
      );
      expect(result).toEqual({ slide: { _id: 'sl1' } });
      expect(updateSlideByIdMock).not.toHaveBeenCalled();
    });

    it('routes to restoreSlideById when isDeleted is in the body', async () => {
      restoreSlideByIdMock.mockResolvedValue({ _id: 'sl1', isDeleted: false });

      const result = await controller.update(
        { param: 'sl1', body: { isDeleted: false } },
        { ctx: 1 }
      );

      expect(restoreSlideByIdMock).toHaveBeenCalledWith({ slideId: 'sl1' }, {}, { ctx: 1 });
      expect(result).toEqual({ slide: { _id: 'sl1', isDeleted: false } });
      expect(updateSlideByIdMock).not.toHaveBeenCalled();
    });

    it('routes to lockSlide when isLocked: true is in the body', async () => {
      lockSlideMock.mockResolvedValue({ _id: 'sl1', isLocked: true });

      const result = await controller.update(
        { param: 'sl1', body: { isLocked: true } },
        { ctx: 1 }
      );

      expect(lockSlideMock).toHaveBeenCalledWith({ slideId: 'sl1' }, {}, { ctx: 1 });
      expect(unlockSlideMock).not.toHaveBeenCalled();
      expect(result).toEqual({ slide: { _id: 'sl1', isLocked: true } });
    });

    it('routes to unlockSlide when isLocked: false is in the body', async () => {
      unlockSlideMock.mockResolvedValue({ _id: 'sl1', isLocked: false });

      const result = await controller.update(
        { param: 'sl1', body: { isLocked: false } },
        { ctx: 1 }
      );

      expect(unlockSlideMock).toHaveBeenCalledWith({ slideId: 'sl1' }, {}, { ctx: 1 });
      expect(lockSlideMock).not.toHaveBeenCalled();
      expect(result).toEqual({ slide: { _id: 'sl1', isLocked: false } });
    });

    it('routes to updateSlideById otherwise', async () => {
      updateSlideByIdMock.mockResolvedValue({ _id: 'sl1', name: 'Renamed' });

      const result = await controller.update(
        { param: 'sl1', body: { name: 'Renamed' } },
        { ctx: 1 }
      );

      expect(updateSlideByIdMock).toHaveBeenCalledWith(
        { slideId: 'sl1', update: { name: 'Renamed' } },
        {},
        { ctx: 1 }
      );
      expect(result).toEqual({ slide: { _id: 'sl1', name: 'Renamed' } });
    });
  });

  describe('delete', () => {
    it('routes to deleteSlideById and wraps under "slide"', async () => {
      deleteSlideByIdMock.mockResolvedValue({ _id: 'sl1', isDeleted: true });

      const result = await controller.delete({ param: 'sl1' }, { ctx: 1 });

      expect(deleteSlideByIdMock).toHaveBeenCalledWith({ slideId: 'sl1' }, {}, { ctx: 1 });
      expect(result).toEqual({ slide: { _id: 'sl1', isDeleted: true } });
    });
  });
});
