import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { createJobMock } = vi.hoisted(() => ({ createJobMock: vi.fn() }));

vi.mock('#core/queues/helpers/createJob.js', () => ({
  default: (...args) => createJobMock(...args)
}));

import setAssetToUploaded from '../services/setAssetToUploaded.js';

const db = setupMongo();

const createAsset = (overrides = {}) => db.models.Asset.create({
  name: 'asset', fileType: 'image', extension: 'png', createdBy: new mongoose.Types.ObjectId(), isUploading: true, ...overrides
});

describe('setAssetToUploaded (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createJobMock.mockResolvedValue({ id: 'job-1' });
  });

  it('throws 404 when the asset does not exist', async () => {
    await expect(
      setAssetToUploaded({ assetId: new mongoose.Types.ObjectId() }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 404, message: 'This asset does not exist' });
  });

  it('marks the asset as not-uploading and processing', async () => {
    const asset = await createAsset({ fileType: 'image' });
    await setAssetToUploaded({ assetId: asset._id }, {}, { models: db.models });

    const stored = await db.models.Asset.findById(asset._id).lean();
    expect(stored.isUploading).toBe(false);
    expect(stored.isProcessing).toBe(true);
  });

  it('schedules MP3 + transcript children for audio/wav assets', async () => {
    const asset = await createAsset({ fileType: 'audio', mimetype: 'audio/wav' });
    await setAssetToUploaded({ assetId: asset._id }, {}, { models: db.models });

    const flow = createJobMock.mock.calls[0][0];
    expect(flow.children.map((c) => c.name)).toEqual(['PROCESS_ASSET_TO_MP3', 'PROCESS_ASSET_TRANSCRIPT']);
  });

  it('schedules sizes + aria-label children for image assets', async () => {
    const asset = await createAsset({ fileType: 'image' });
    await setAssetToUploaded({ assetId: asset._id }, {}, { models: db.models });

    const flow = createJobMock.mock.calls[0][0];
    expect(flow.children.map((c) => c.name)).toEqual(['PROCESS_ASSET_SIZES', 'PROCESS_ASSET_ARIA_LABEL']);
  });

  it('schedules no children for non-wav audio', async () => {
    const asset = await createAsset({ fileType: 'audio', mimetype: 'audio/mpeg' });
    await setAssetToUploaded({ assetId: asset._id }, {}, { models: db.models });

    const flow = createJobMock.mock.calls[0][0];
    expect(flow.children).toEqual([]);
  });

  it('schedules a PROCESS_ASSET parent job carrying the assetId and returns the jobId', async () => {
    const asset = await createAsset({ fileType: 'image' });
    createJobMock.mockResolvedValue({ id: 'job-42' });

    const result = await setAssetToUploaded({ assetId: asset._id }, {}, { models: db.models });

    const flow = createJobMock.mock.calls[0][0];
    expect(flow).toMatchObject({ queue: 'assets', name: 'PROCESS_ASSET' });
    expect(String(flow.job.assetId)).toBe(String(asset._id));
    expect(result.jobId).toBe('job-42');
  });
});
