import { describe, it, expect, vi, beforeEach } from 'vitest';

const { createJobMock } = vi.hoisted(() => ({
  createJobMock: vi.fn()
}));

vi.mock('#core/queues/helpers/createJob.js', () => ({
  default: (...args) => createJobMock(...args)
}));

import setAssetToUploaded from '../services/setAssetToUploaded.js';

const buildModels = (asset) => ({
  Asset: { findByIdAndUpdate: vi.fn().mockResolvedValue(asset) }
});

describe('setAssetToUploaded', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createJobMock.mockResolvedValue({ id: 'job-1' });
  });

  it('throws 404 when the asset does not exist', async () => {
    const models = buildModels(null);
    await expect(setAssetToUploaded({ assetId: 'a1' }, {}, { models }))
      .rejects.toMatchObject({ statusCode: 404, message: 'This asset does not exist' });
  });

  it('marks the asset as not-uploading and processing', async () => {
    const asset = { _id: 'a1', fileType: 'image' };
    const models = buildModels(asset);

    await setAssetToUploaded({ assetId: 'a1' }, {}, { models });

    expect(models.Asset.findByIdAndUpdate).toHaveBeenCalledWith('a1', {
      isUploading: false,
      isProcessing: true
    }, { new: true });
  });

  it('schedules MP3 + transcript children for audio/wav assets', async () => {
    const models = buildModels({ _id: 'a1', fileType: 'audio', mimetype: 'audio/wav' });
    await setAssetToUploaded({ assetId: 'a1' }, {}, { models });

    const flow = createJobMock.mock.calls[0][0];
    expect(flow.children.map((c) => c.name)).toEqual(['PROCESS_ASSET_TO_MP3', 'PROCESS_ASSET_TRANSCRIPT']);
  });

  it('schedules sizes + aria-label children for image assets', async () => {
    const models = buildModels({ _id: 'a1', fileType: 'image' });
    await setAssetToUploaded({ assetId: 'a1' }, {}, { models });

    const flow = createJobMock.mock.calls[0][0];
    expect(flow.children.map((c) => c.name)).toEqual(['PROCESS_ASSET_SIZES', 'PROCESS_ASSET_ARIA_LABEL']);
  });

  it('schedules no children for unsupported asset types', async () => {
    const models = buildModels({ _id: 'a1', fileType: 'video' });
    await setAssetToUploaded({ assetId: 'a1' }, {}, { models });

    const flow = createJobMock.mock.calls[0][0];
    expect(flow.children).toEqual([]);
  });

  it('does not schedule MP3/transcript children for non-wav audio', async () => {
    const models = buildModels({ _id: 'a1', fileType: 'audio', mimetype: 'audio/mpeg' });
    await setAssetToUploaded({ assetId: 'a1' }, {}, { models });

    const flow = createJobMock.mock.calls[0][0];
    expect(flow.children).toEqual([]);
  });

  it('schedules a PROCESS_ASSET parent job carrying the assetId', async () => {
    const models = buildModels({ _id: 'a1', fileType: 'image' });
    await setAssetToUploaded({ assetId: 'a1' }, {}, { models });

    const flow = createJobMock.mock.calls[0][0];
    expect(flow).toMatchObject({
      queue: 'assets',
      name: 'PROCESS_ASSET',
      job: { assetId: 'a1' }
    });
  });

  it('returns the asset and the parent jobId', async () => {
    const asset = { _id: 'a1', fileType: 'image' };
    const models = buildModels(asset);
    createJobMock.mockResolvedValue({ id: 'job-42' });

    const result = await setAssetToUploaded({ assetId: 'a1' }, {}, { models });

    expect(result).toEqual({ asset, jobId: 'job-42' });
  });
});
