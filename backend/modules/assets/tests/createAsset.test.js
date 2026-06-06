import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { getUploadSignedUrlMock } = vi.hoisted(() => ({ getUploadSignedUrlMock: vi.fn() }));

vi.mock('../helpers/getUploadSignedUrl.js', () => ({
  default: (...args) => getUploadSignedUrlMock(...args)
}));

import createAsset from '../services/createAsset.js';

const db = setupMongo();

describe('createAsset (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUploadSignedUrlMock.mockResolvedValue('https://signed.example.com/upload');
  });

  it('creates the asset with sanitized name, fileType, extension and isUploading=true', async () => {
    const result = await createAsset(
      { name: 'my photo.png', width: 100, height: 200, orientation: 'landscape', mimetype: 'image/png', isTemporary: false },
      {},
      { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
    );

    const stored = await db.models.Asset.findById(result.asset._id).lean();
    expect(stored.name).toBe('my_photo');
    expect(stored.fileType).toBe('image');
    expect(stored.extension).toBe('png');
    expect(stored.isUploading).toBe(true);
    expect(stored.width).toBe(100);
  });

  it('signs an upload URL using the constructed asset path and returns asset + signedUrl', async () => {
    const result = await createAsset(
      { name: 'photo.png', mimetype: 'image/png' },
      {},
      { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
    );

    expect(getUploadSignedUrlMock).toHaveBeenCalledWith({
      assetPath: `assets/images/${result.asset._id}/original/photo.png`,
      ACL: 'public-read',
      ContentType: 'image/png'
    });
    expect(result.signedUrl).toBe('https://signed.example.com/upload');
  });

  it('handles filenames containing dots when stripping the extension', async () => {
    const result = await createAsset(
      { name: 'my.photo.with.dots.png', mimetype: 'image/png' },
      {},
      { models: db.models, user: { _id: new mongoose.Types.ObjectId() } }
    );

    const stored = await db.models.Asset.findById(result.asset._id).lean();
    expect(stored.name).toBe('my.photo.with.dots');
  });
});
