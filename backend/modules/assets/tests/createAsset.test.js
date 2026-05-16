import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getUploadSignedUrlMock } = vi.hoisted(() => ({
  getUploadSignedUrlMock: vi.fn()
}));

vi.mock('../helpers/getUploadSignedUrl.js', () => ({
  default: (...args) => getUploadSignedUrlMock(...args)
}));

import createAsset from '../services/createAsset.js';

const buildModels = (created = {}) => ({
  Asset: { create: vi.fn().mockResolvedValue({ _id: 'asset-1', ...created }) }
});

describe('createAsset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUploadSignedUrlMock.mockResolvedValue('https://signed.example.com/upload');
  });

  it('creates the asset with sanitized name, fileType, extension, and isUploading=true', async () => {
    const models = buildModels();

    await createAsset(
      { name: 'my photo.png', width: 100, height: 200, orientation: 'landscape', mimetype: 'image/png', isTemporary: false },
      {},
      { models, user: { _id: 'user-1' } }
    );

    expect(models.Asset.create).toHaveBeenCalledWith({
      name: 'my_photo',
      fileType: 'image',
      extension: 'png',
      createdBy: 'user-1',
      isUploading: true,
      width: 100,
      height: 200,
      orientation: 'landscape',
      mimetype: 'image/png',
      isTemporary: false
    });
  });

  it('signs an upload URL using the constructed asset path', async () => {
    const models = buildModels();

    await createAsset(
      { name: 'photo.png', mimetype: 'image/png' },
      {},
      { models, user: { _id: 'user-1' } }
    );

    expect(getUploadSignedUrlMock).toHaveBeenCalledWith({
      assetPath: 'assets/images/asset-1/original/photo.png',
      ACL: 'public-read',
      ContentType: 'image/png'
    });
  });

  it('returns the created asset and signed URL', async () => {
    const models = buildModels();

    const result = await createAsset(
      { name: 'photo.png', mimetype: 'image/png' },
      {},
      { models, user: { _id: 'user-1' } }
    );

    expect(result).toEqual({
      asset: { _id: 'asset-1' },
      signedUrl: 'https://signed.example.com/upload'
    });
  });

  it('handles filenames containing dots correctly when stripping the extension', async () => {
    const models = buildModels();

    await createAsset(
      { name: 'my.photo.with.dots.png', mimetype: 'image/png' },
      {},
      { models, user: { _id: 'user-1' } }
    );

    expect(models.Asset.create).toHaveBeenCalledWith(expect.objectContaining({
      name: 'my.photo.with.dots'
    }));
  });
});
