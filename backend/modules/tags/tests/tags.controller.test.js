import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getTagsMock,
  getTagByIdMock,
  restoreTagByIdMock,
  updateTagByIdMock,
  deleteTagByIdMock,
  createTagMock
} = vi.hoisted(() => ({
  getTagsMock: vi.fn(),
  getTagByIdMock: vi.fn(),
  restoreTagByIdMock: vi.fn(),
  updateTagByIdMock: vi.fn(),
  deleteTagByIdMock: vi.fn(),
  createTagMock: vi.fn()
}));

vi.mock('../services/getTags.js', () => ({ default: (...args) => getTagsMock(...args) }));
vi.mock('../services/getTagById.js', () => ({ default: (...args) => getTagByIdMock(...args) }));
vi.mock('../services/restoreTagById.js', () => ({ default: (...args) => restoreTagByIdMock(...args) }));
vi.mock('../services/updateTagById.js', () => ({ default: (...args) => updateTagByIdMock(...args) }));
vi.mock('../services/deleteTagById.js', () => ({ default: (...args) => deleteTagByIdMock(...args) }));
vi.mock('../services/createTag.js', () => ({ default: (...args) => createTagMock(...args) }));

import controller from '../tags.controller.js';

describe('tags.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('forwards searchValue/currentPage/isDeleted to getTags', async () => {
      getTagsMock.mockResolvedValue({ tags: [] });

      await controller.all(
        { query: { searchValue: 'foo', currentPage: 2, isDeleted: false } },
        { ctx: 1 }
      );

      expect(getTagsMock).toHaveBeenCalledWith(
        { tagType: undefined },
        { searchValue: 'foo', currentPage: 2, isDeleted: false },
        { ctx: 1 }
      );
    });

    it('forwards tagType through to getTags as a prop when supplied', async () => {
      getTagsMock.mockResolvedValue({ tags: [] });

      await controller.all(
        { query: { tagType: 'CATEGORY' } },
        { ctx: 1 }
      );

      expect(getTagsMock).toHaveBeenCalledWith(
        { tagType: 'CATEGORY' },
        expect.any(Object),
        { ctx: 1 }
      );
    });
  });

  describe('create', () => {
    it('creates a tag from name + tagType and wraps under "tag"', async () => {
      createTagMock.mockResolvedValue({ _id: 't1' });

      const result = await controller.create(
        { body: { name: 'New', tagType: 'CATEGORY' } },
        { ctx: 1 }
      );

      expect(createTagMock).toHaveBeenCalledWith(
        { name: 'New', tagType: 'CATEGORY' },
        {},
        { ctx: 1 }
      );
      expect(result).toEqual({ tag: { _id: 't1' } });
    });
  });

  describe('read', () => {
    it('looks up by URL param and wraps under "tag"', async () => {
      getTagByIdMock.mockResolvedValue({ _id: 't1' });

      const result = await controller.read({ param: 't1' }, { ctx: 1 });

      expect(getTagByIdMock).toHaveBeenCalledWith({ tagId: 't1' }, {}, { ctx: 1 });
      expect(result).toEqual({ tag: { _id: 't1' } });
    });
  });

  describe('update', () => {
    it('routes to restoreTagById when isDeleted is in the body', async () => {
      restoreTagByIdMock.mockResolvedValue({ _id: 't1', isDeleted: false });

      const result = await controller.update(
        { param: 't1', body: { isDeleted: false } },
        { ctx: 1 }
      );

      expect(restoreTagByIdMock).toHaveBeenCalledWith({ tagId: 't1' }, {}, { ctx: 1 });
      expect(updateTagByIdMock).not.toHaveBeenCalled();
      expect(result).toEqual({ tag: { _id: 't1', isDeleted: false } });
    });

    it('routes to updateTagById otherwise', async () => {
      updateTagByIdMock.mockResolvedValue({ _id: 't1', name: 'Renamed' });

      const result = await controller.update(
        { param: 't1', body: { name: 'Renamed' } },
        { ctx: 1 }
      );

      expect(updateTagByIdMock).toHaveBeenCalledWith(
        { tagId: 't1', update: { name: 'Renamed' } },
        {},
        { ctx: 1 }
      );
      expect(result).toEqual({ tag: { _id: 't1', name: 'Renamed' } });
    });
  });

  describe('delete', () => {
    it('routes to deleteTagById and wraps under "tag"', async () => {
      deleteTagByIdMock.mockResolvedValue({ _id: 't1', isDeleted: true });

      const result = await controller.delete({ param: 't1' }, { ctx: 1 });

      expect(deleteTagByIdMock).toHaveBeenCalledWith({ tagId: 't1' }, {}, { ctx: 1 });
      expect(result).toEqual({ tag: { _id: 't1', isDeleted: true } });
    });
  });
});
