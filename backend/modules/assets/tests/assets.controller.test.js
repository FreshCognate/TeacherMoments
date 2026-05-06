import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getAssetsMock,
  createAssetMock,
  getAssetByIdMock,
  restoreAssetByIdMock,
  updateAssetByIdMock,
  deleteAssetByIdMock,
  setAssetToUploadedMock
} = vi.hoisted(() => ({
  getAssetsMock: vi.fn(),
  createAssetMock: vi.fn(),
  getAssetByIdMock: vi.fn(),
  restoreAssetByIdMock: vi.fn(),
  updateAssetByIdMock: vi.fn(),
  deleteAssetByIdMock: vi.fn(),
  setAssetToUploadedMock: vi.fn()
}));

vi.mock('../services/getAssets.js', () => ({ default: (...args) => getAssetsMock(...args) }));
vi.mock('../services/createAsset.js', () => ({ default: (...args) => createAssetMock(...args) }));
vi.mock('../services/getAssetById.js', () => ({ default: (...args) => getAssetByIdMock(...args) }));
vi.mock('../services/restoreAssetById.js', () => ({ default: (...args) => restoreAssetByIdMock(...args) }));
vi.mock('../services/updateAssetById.js', () => ({ default: (...args) => updateAssetByIdMock(...args) }));
vi.mock('../services/deleteAssetById.js', () => ({ default: (...args) => deleteAssetByIdMock(...args) }));
vi.mock('../services/setAssetToUploaded.js', () => ({ default: (...args) => setAssetToUploadedMock(...args) }));

import controller from '../assets.controller.js';

describe('assets.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('all', () => {
    it('forwards searchValue, currentPage, isDeleted to getAssets', async () => {
      getAssetsMock.mockResolvedValue({ assets: [] });
      await controller.all({ query: { searchValue: 'photo', currentPage: 2, isDeleted: true } }, { ctx: 1 });

      expect(getAssetsMock).toHaveBeenCalledWith({}, { searchValue: 'photo', currentPage: 2, isDeleted: true }, { ctx: 1 });
    });
  });

  describe('create', () => {
    it('passes the asset properties through and returns asset + signedUrl', async () => {
      createAssetMock.mockResolvedValue({ asset: { _id: 'a1' }, signedUrl: 'https://signed' });

      const result = await controller.create({
        body: { name: 'photo.png', width: 100, height: 200, orientation: 'landscape', mimetype: 'image/png', isTemporary: true }
      }, {});

      expect(createAssetMock).toHaveBeenCalledWith({
        name: 'photo.png',
        width: 100,
        height: 200,
        orientation: 'landscape',
        mimetype: 'image/png',
        isTemporary: true
      }, {}, {});
      expect(result).toEqual({ asset: { _id: 'a1' }, signedUrl: 'https://signed' });
    });
  });

  describe('read', () => {
    it('looks up by URL param and wraps under "asset"', async () => {
      getAssetByIdMock.mockResolvedValue({ _id: 'a1' });
      const result = await controller.read({ param: 'a1' }, {});
      expect(getAssetByIdMock).toHaveBeenCalledWith({ assetId: 'a1' }, {}, {});
      expect(result).toEqual({ asset: { _id: 'a1' } });
    });
  });

  describe('update', () => {
    it('routes to setAssetToUploaded when isUploading is in the body', async () => {
      setAssetToUploadedMock.mockResolvedValue({ asset: { _id: 'a1' }, jobId: 'job-1' });

      const result = await controller.update({ param: 'a1', body: { isUploading: false } }, {});

      expect(setAssetToUploadedMock).toHaveBeenCalledWith({ assetId: 'a1' }, {}, {});
      expect(result).toEqual({ asset: { _id: 'a1' }, jobId: 'job-1' });
      expect(updateAssetByIdMock).not.toHaveBeenCalled();
      expect(restoreAssetByIdMock).not.toHaveBeenCalled();
    });

    it('routes to restoreAssetById when isDeleted is in the body', async () => {
      restoreAssetByIdMock.mockResolvedValue({ _id: 'a1', isDeleted: false });

      const result = await controller.update({ param: 'a1', body: { isDeleted: false } }, {});

      expect(restoreAssetByIdMock).toHaveBeenCalledWith({ assetId: 'a1' }, {}, {});
      expect(result).toEqual({ asset: { _id: 'a1', isDeleted: false } });
      expect(updateAssetByIdMock).not.toHaveBeenCalled();
    });

    it('routes to updateAssetById otherwise', async () => {
      updateAssetByIdMock.mockResolvedValue({ _id: 'a1', name: 'new' });

      const result = await controller.update({ param: 'a1', body: { name: 'new' } }, {});

      expect(updateAssetByIdMock).toHaveBeenCalledWith({ assetId: 'a1', update: { name: 'new' } }, {}, {});
      expect(result).toEqual({ asset: { _id: 'a1', name: 'new' } });
    });
  });

  describe('delete', () => {
    it('deletes via deleteAssetById and wraps under "asset"', async () => {
      deleteAssetByIdMock.mockResolvedValue({ _id: 'a1', isDeleted: true });

      const result = await controller.delete({ param: 'a1' }, {});

      expect(deleteAssetByIdMock).toHaveBeenCalledWith({ assetId: 'a1' }, {}, {});
      expect(result).toEqual({ asset: { _id: 'a1', isDeleted: true } });
    });
  });
});
