import { describe, it, expect, vi } from 'vitest';
import createTranscript from '../services/createTranscript.js';

describe('createTranscript', () => {
  it('creates a transcript, mapping assetId → asset', async () => {
    const create = vi.fn().mockResolvedValue({ _id: 'tr1' });

    const result = await createTranscript(
      {
        language: 'en',
        duration: 12.5,
        text: 'hello world',
        segments: [{ start: 0, end: 1, text: 'hello' }],
        assetId: 'a1',
        createdBy: 'u1'
      },
      {},
      { models: { Transcript: { create } } }
    );

    expect(create).toHaveBeenCalledWith({
      language: 'en',
      duration: 12.5,
      text: 'hello world',
      segments: [{ start: 0, end: 1, text: 'hello' }],
      asset: 'a1',
      createdBy: 'u1'
    });
    expect(result).toEqual({ _id: 'tr1' });
  });
});
