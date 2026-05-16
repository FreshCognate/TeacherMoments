import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getSocketsMock,
  emitMock,
  convertAudioToMP3Mock,
  createAudioTranscriptMock,
  createAssetSizesMock,
  updateAssetToProcessedMock
} = vi.hoisted(() => ({
  getSocketsMock: vi.fn(),
  emitMock: vi.fn(),
  convertAudioToMP3Mock: vi.fn(),
  createAudioTranscriptMock: vi.fn(),
  createAssetSizesMock: vi.fn(),
  updateAssetToProcessedMock: vi.fn()
}));

vi.mock('../../../backend/modules/assets/index.js', () => ({}));
vi.mock('../../../backend/modules/transcripts/index.js', () => ({}));

vi.mock('../../tasks/convertAudioToMP3.js', () => ({
  default: (...args) => convertAudioToMP3Mock(...args)
}));
vi.mock('../../tasks/createAudioTranscript.js', () => ({
  default: (...args) => createAudioTranscriptMock(...args)
}));
vi.mock('../../tasks/createAssetSizes.js', () => ({
  default: (...args) => createAssetSizesMock(...args)
}));
vi.mock('../../tasks/updateAssetToProcessed.js', () => ({
  default: (...args) => updateAssetToProcessedMock(...args)
}));
vi.mock('../../getSockets.js', () => ({
  default: (...args) => getSocketsMock(...args)
}));

import assetsRunner from '../assets.js';

beforeEach(() => {
  vi.clearAllMocks();
  getSocketsMock.mockResolvedValue({ emit: emitMock });
});

describe('assets runner', () => {
  it('PROCESS_ASSET_TO_MP3: emits AUDIO_PROCESSING, runs convertAudioToMP3, emits AUDIO_PROCESSED (keyed by parent job id)', async () => {
    await assetsRunner({
      id: 'j1',
      name: 'PROCESS_ASSET_TO_MP3',
      parent: { id: 'parent1' },
      data: { assetId: 'a1' }
    });

    expect(convertAudioToMP3Mock).toHaveBeenCalledWith({ assetId: 'a1' });
    expect(emitMock).toHaveBeenNthCalledWith(1, 'workers:assets:parent1', { event: 'AUDIO_PROCESSING' });
    expect(emitMock).toHaveBeenNthCalledWith(2, 'workers:assets:parent1', { event: 'AUDIO_PROCESSED' });
  });

  it('PROCESS_ASSET_TRANSCRIPT: emits TRANSCRIPT_PROCESSING / TRANSCRIPT_PROCESSED around the task', async () => {
    await assetsRunner({
      id: 'j2',
      name: 'PROCESS_ASSET_TRANSCRIPT',
      parent: { id: 'parent2' },
      data: { assetId: 'a1' }
    });

    expect(createAudioTranscriptMock).toHaveBeenCalledWith({ assetId: 'a1' });
    expect(emitMock).toHaveBeenNthCalledWith(1, 'workers:assets:parent2', { event: 'TRANSCRIPT_PROCESSING' });
    expect(emitMock).toHaveBeenNthCalledWith(2, 'workers:assets:parent2', { event: 'TRANSCRIPT_PROCESSED' });
  });

  it('PROCESS_ASSET_SIZES: emits IMAGES_PROCESSING / IMAGES_PROCESSED around the task', async () => {
    await assetsRunner({
      id: 'j3',
      name: 'PROCESS_ASSET_SIZES',
      parent: { id: 'parent3' },
      data: { assetId: 'a1' }
    });

    expect(createAssetSizesMock).toHaveBeenCalledWith({ assetId: 'a1' });
    expect(emitMock).toHaveBeenNthCalledWith(1, 'workers:assets:parent3', { event: 'IMAGES_PROCESSING' });
    expect(emitMock).toHaveBeenNthCalledWith(2, 'workers:assets:parent3', { event: 'IMAGES_PROCESSED' });
  });

  it('PROCESS_ASSET: runs updateAssetToProcessed and emits ASSET_PROCESSED keyed by the job id (not parent)', async () => {
    await assetsRunner({
      id: 'job4',
      name: 'PROCESS_ASSET',
      data: { assetId: 'a1' }
    });

    expect(updateAssetToProcessedMock).toHaveBeenCalledWith({ assetId: 'a1' });
    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith('workers:assets:job4', { event: 'ASSET_PROCESSED' });
  });

  it('does nothing for unknown job names', async () => {
    await assetsRunner({ id: 'j5', name: 'UNKNOWN', parent: { id: 'p' }, data: {} });

    expect(convertAudioToMP3Mock).not.toHaveBeenCalled();
    expect(createAudioTranscriptMock).not.toHaveBeenCalled();
    expect(createAssetSizesMock).not.toHaveBeenCalled();
    expect(updateAssetToProcessedMock).not.toHaveBeenCalled();
    expect(emitMock).not.toHaveBeenCalled();
  });

  it('re-throws when the underlying task fails', async () => {
    convertAudioToMP3Mock.mockRejectedValue(new Error('boom'));

    await expect(
      assetsRunner({ id: 'j1', name: 'PROCESS_ASSET_TO_MP3', parent: { id: 'p' }, data: { assetId: 'a1' } })
    ).rejects.toThrow();
  });
});
