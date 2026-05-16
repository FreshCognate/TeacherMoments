import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  connectDatabaseMock,
  findByIdMock,
  getAudioTranscriptionMock,
  createTranscriptMock
} = vi.hoisted(() => ({
  connectDatabaseMock: vi.fn(),
  findByIdMock: vi.fn(),
  getAudioTranscriptionMock: vi.fn(),
  createTranscriptMock: vi.fn()
}));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));
vi.mock('../../agents/helpers/getAudioTranscription.js', () => ({
  default: (...args) => getAudioTranscriptionMock(...args)
}));
vi.mock('../../../backend/modules/transcripts/services/createTranscript.js', () => ({
  default: (...args) => createTranscriptMock(...args)
}));

import createAudioTranscript from '../createAudioTranscript.js';

describe('createAudioTranscript', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({
      models: { Asset: { findById: findByIdMock } }
    });
  });

  it('transcribes the asset, persists a Transcript record, and stamps the asset with both', async () => {
    const asset = {
      _id: 'a1',
      createdBy: 'u1',
      set: vi.fn(),
      save: vi.fn().mockResolvedValue()
    };
    findByIdMock.mockResolvedValue(asset);

    const transcript = {
      text: 'hello world',
      language: 'en',
      duration: 2.5,
      segments: [{ start: 0, end: 1, text: 'hello' }]
    };
    getAudioTranscriptionMock.mockResolvedValue(transcript);
    createTranscriptMock.mockResolvedValue({ _id: 'tr1' });

    await createAudioTranscript({ assetId: 'a1' });

    expect(getAudioTranscriptionMock).toHaveBeenCalledWith({ asset });
    expect(createTranscriptMock).toHaveBeenCalledWith(
      { ...transcript, assetId: 'a1', createdBy: 'u1' },
      {},
      { models: expect.any(Object) }
    );

    expect(asset.set).toHaveBeenCalledWith('transcript', 'hello world');
    expect(asset.set).toHaveBeenCalledWith('transcriptVerbose', 'tr1');
    expect(asset.save).toHaveBeenCalled();
  });
});
