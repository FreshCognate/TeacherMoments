import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../tests/with-mongo.js';

const { connectDatabaseMock, getAudioTranscriptionMock, createTranscriptMock } = vi.hoisted(() => ({
  connectDatabaseMock: vi.fn(),
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

const db = setupMongo();

describe('createAudioTranscript (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({ models: db.models });
  });

  it('transcribes the asset, persists a Transcript, and stamps the asset with both', async () => {
    const transcriptId = new mongoose.Types.ObjectId();
    const asset = await db.models.Asset.create({
      name: 'audio', fileType: 'audio', extension: 'wav', createdBy: new mongoose.Types.ObjectId()
    });

    const transcript = { text: 'hello world', language: 'en', duration: 2.5, segments: [{ start: 0, end: 1, text: 'hello' }] };
    getAudioTranscriptionMock.mockResolvedValue(transcript);
    createTranscriptMock.mockResolvedValue({ _id: transcriptId });

    await createAudioTranscript({ assetId: asset._id });

    expect(getAudioTranscriptionMock).toHaveBeenCalledWith({ asset: expect.objectContaining({ _id: asset._id }) });
    expect(createTranscriptMock).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'hello world', assetId: asset._id }),
      {},
      { models: expect.any(Object) }
    );

    const stored = await db.models.Asset.findById(asset._id).lean();
    expect(stored.transcript).toBe('hello world');
    expect(String(stored.transcriptVerbose)).toBe(String(transcriptId));
  });
});
