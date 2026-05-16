import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getBlocksMock,
  getBlocksBySlideRefMock,
  getBlocksByScenarioIdMock,
  getBlockByIdMock,
  restoreBlockByIdMock,
  updateBlockByIdMock,
  deleteBlockByIdMock,
  createBlockMock,
  reorderBlockMock
} = vi.hoisted(() => ({
  getBlocksMock: vi.fn(),
  getBlocksBySlideRefMock: vi.fn(),
  getBlocksByScenarioIdMock: vi.fn(),
  getBlockByIdMock: vi.fn(),
  restoreBlockByIdMock: vi.fn(),
  updateBlockByIdMock: vi.fn(),
  deleteBlockByIdMock: vi.fn(),
  createBlockMock: vi.fn(),
  reorderBlockMock: vi.fn()
}));

vi.mock('../services/getBlocks.js', () => ({ default: (...args) => getBlocksMock(...args) }));
vi.mock('../services/getBlocksByScenarioIdAndSlideRef.js', () => ({ default: (...args) => getBlocksBySlideRefMock(...args) }));
vi.mock('../services/getBlocksByScenarioId.js', () => ({ default: (...args) => getBlocksByScenarioIdMock(...args) }));
vi.mock('../services/getBlockById.js', () => ({ default: (...args) => getBlockByIdMock(...args) }));
vi.mock('../services/restoreBlockById.js', () => ({ default: (...args) => restoreBlockByIdMock(...args) }));
vi.mock('../services/updateBlockById.js', () => ({ default: (...args) => updateBlockByIdMock(...args) }));
vi.mock('../services/deleteBlockById.js', () => ({ default: (...args) => deleteBlockByIdMock(...args) }));
vi.mock('../services/createBlock.js', () => ({ default: (...args) => createBlockMock(...args) }));
vi.mock('../services/reorderBlock.js', () => ({ default: (...args) => reorderBlockMock(...args) }));

import controller from '../blocks.controller.js';

describe('blocks.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('routes to getBlocksByScenarioIdAndSlideRef when scenarioId AND slideRef are present', async () => {
      getBlocksBySlideRefMock.mockResolvedValue({ blocks: [] });

      await controller.all({ query: { scenarioId: 's1', slideRef: 'slide-1', isDeleted: false } }, { ctx: 1 });

      expect(getBlocksBySlideRefMock).toHaveBeenCalledWith({ scenarioId: 's1', slideRef: 'slide-1' }, { isDeleted: false }, { ctx: 1 });
      expect(getBlocksByScenarioIdMock).not.toHaveBeenCalled();
      expect(getBlocksMock).not.toHaveBeenCalled();
    });

    it('routes to getBlocksByScenarioId when only scenarioId is present', async () => {
      getBlocksByScenarioIdMock.mockResolvedValue({ blocks: [] });

      await controller.all({ query: { scenarioId: 's1', isDeleted: true } }, { ctx: 1 });

      expect(getBlocksByScenarioIdMock).toHaveBeenCalledWith({ scenarioId: 's1' }, { isDeleted: true }, { ctx: 1 });
      expect(getBlocksMock).not.toHaveBeenCalled();
    });

    it('routes to getBlocks (general listing) otherwise', async () => {
      getBlocksMock.mockResolvedValue({ blocks: [] });

      await controller.all({ query: { searchValue: 'foo', currentPage: 2, isDeleted: false } }, { ctx: 1 });

      expect(getBlocksMock).toHaveBeenCalledWith({}, { searchValue: 'foo', currentPage: 2, isDeleted: false }, { ctx: 1 });
    });
  });

  describe('create', () => {
    it('creates a block from scenarioId/slideRef/blockType and wraps under "block"', async () => {
      createBlockMock.mockResolvedValue({ _id: 'b1' });

      const result = await controller.create({
        body: { scenarioId: 's1', slideRef: 'slide-1', blockType: 'TEXT' }
      }, {});

      expect(createBlockMock).toHaveBeenCalledWith({ scenario: 's1', slideRef: 'slide-1', blockType: 'TEXT' }, {}, {});
      expect(result).toEqual({ block: { _id: 'b1' } });
    });
  });

  describe('read', () => {
    it('looks up by URL param and wraps under "block"', async () => {
      getBlockByIdMock.mockResolvedValue({ _id: 'b1' });

      const result = await controller.read({ param: 'b1' }, {});
      expect(getBlockByIdMock).toHaveBeenCalledWith({ blockId: 'b1' }, {}, {});
      expect(result).toEqual({ block: { _id: 'b1' } });
    });
  });

  describe('update', () => {
    it('routes to restoreBlockById when isDeleted is in the body', async () => {
      restoreBlockByIdMock.mockResolvedValue({ _id: 'b1', isDeleted: false });

      const result = await controller.update({ param: 'b1', body: { isDeleted: false } }, {});

      expect(restoreBlockByIdMock).toHaveBeenCalledWith({ blockId: 'b1' }, {}, {});
      expect(result).toEqual({ block: { _id: 'b1', isDeleted: false } });
      expect(updateBlockByIdMock).not.toHaveBeenCalled();
    });

    it('routes to reorderBlock when sourceIndex or destinationIndex is in the body', async () => {
      reorderBlockMock.mockResolvedValue({ _id: 'b1' });

      const result = await controller.update({
        param: 'b1',
        body: { sourceIndex: 0, destinationIndex: 2 }
      }, {});

      expect(reorderBlockMock).toHaveBeenCalledWith({ sourceIndex: 0, destinationIndex: 2, blockId: 'b1' }, {}, {});
      expect(result).toEqual({ block: { _id: 'b1' } });
      expect(updateBlockByIdMock).not.toHaveBeenCalled();
    });

    it('routes to updateBlockById otherwise', async () => {
      updateBlockByIdMock.mockResolvedValue({ _id: 'b1', name: 'new' });

      const result = await controller.update({ param: 'b1', body: { name: 'new' } }, {});

      expect(updateBlockByIdMock).toHaveBeenCalledWith({ blockId: 'b1', update: { name: 'new' } }, {}, {});
      expect(result).toEqual({ block: { _id: 'b1', name: 'new' } });
    });
  });

  describe('delete', () => {
    it('routes to deleteBlockById and wraps under "block"', async () => {
      deleteBlockByIdMock.mockResolvedValue({ _id: 'b1', isDeleted: true });

      const result = await controller.delete({ param: 'b1' }, {});

      expect(deleteBlockByIdMock).toHaveBeenCalledWith({ blockId: 'b1' }, {}, {});
      expect(result).toEqual({ block: { _id: 'b1', isDeleted: true } });
    });
  });
});
