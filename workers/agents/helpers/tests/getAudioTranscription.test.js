import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getGeminiMock, downloadAssetMock, generateContentMock, readFileSyncMock } = vi.hoisted(() => ({
  getGeminiMock: vi.fn(),
  downloadAssetMock: vi.fn(),
  generateContentMock: vi.fn(),
  readFileSyncMock: vi.fn()
}));

vi.mock('../getGemini.js', () => ({
  default: (...args) => getGeminiMock(...args)
}));
vi.mock('../../../helpers/downloadAsset.js', () => ({
  default: (...args) => downloadAssetMock(...args)
}));
vi.mock('fs', () => ({
  default: { readFileSync: (...args) => readFileSyncMock(...args) }
}));

import getAudioTranscription from '../getAudioTranscription.js';

beforeEach(() => {
  vi.clearAllMocks();
  getGeminiMock.mockReturnValue({ models: { generateContent: generateContentMock } });
  downloadAssetMock.mockResolvedValue({ assetPath: '/tmp/asset/audio.mp3' });
  readFileSyncMock.mockReturnValue('BASE64DATA');
  generateContentMock.mockResolvedValue({
    text: '{"language":"en","duration":1.5,"text":"hi","segments":[]}'
  });
});

describe('getAudioTranscription', () => {
  it('downloads the asset, reads it as base64, and returns the parsed transcription JSON', async () => {
    const asset = { _id: 'a1', name: 'audio', extension: 'mp3', mimetype: 'audio/mpeg' };

    const result = await getAudioTranscription({ asset });

    expect(downloadAssetMock).toHaveBeenCalledWith({ asset });
    expect(readFileSyncMock).toHaveBeenCalledWith('/tmp/asset/audio.mp3', { encoding: 'base64' });

    expect(result).toEqual({ language: 'en', duration: 1.5, text: 'hi', segments: [] });
  });

  it('sends the audio inline with the asset mimetype and the JSON response schema', async () => {
    const asset = { _id: 'a1', name: 'audio', extension: 'wav', mimetype: 'audio/wav' };

    await getAudioTranscription({ asset });

    const callArgs = generateContentMock.mock.calls[0][0];
    expect(callArgs.model).toBe('gemini-2.5-flash-lite');
    expect(callArgs.contents[1]).toEqual({
      inlineData: { mimeType: 'audio/wav', data: 'BASE64DATA' }
    });
    expect(callArgs.config.responseMimeType).toBe('application/json');
    expect(callArgs.config.responseSchema.required).toEqual(['language', 'duration', 'text', 'segments']);
  });

  it('defaults the mimetype to audio/mpeg when the asset does not specify one', async () => {
    const asset = { _id: 'a1', name: 'audio', extension: 'mp3' };

    await getAudioTranscription({ asset });

    expect(generateContentMock.mock.calls[0][0].contents[1].inlineData.mimeType).toBe('audio/mpeg');
  });
});
