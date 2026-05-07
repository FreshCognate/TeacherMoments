import { describe, it, expect, vi } from 'vitest';
import populateRun from '../helpers/populateRun.js';

const buildAudioId = (id) => ({
  toString: () => id,
  equals: function (other) { return this === other || (other && other.toString && other.toString() === id); }
});

describe('populateRun', () => {
  it('replaces each block.audio id with the matching Asset document across all stages', async () => {
    const audioId1 = buildAudioId('a1');
    const audioId2 = buildAudioId('a2');

    const audio1 = { _id: audioId1, transcript: 'one' };
    const audio2 = { _id: audioId2, transcript: 'two' };

    const find = vi.fn().mockResolvedValue([audio1, audio2]);

    const run = {
      stages: [{
        blocksByRef: {
          'block-1': { audio: audioId1 },
          'block-2': { audio: audioId2 }
        }
      }]
    };

    const result = await populateRun({ run }, { models: { Asset: { find } } });

    expect(result.stages[0].blocksByRef['block-1'].audio).toBe(audio1);
    expect(result.stages[0].blocksByRef['block-2'].audio).toBe(audio2);
  });

  it('skips blocks that have no audio id', async () => {
    const audioId = buildAudioId('a1');
    const audio = { _id: audioId, transcript: 'hi' };
    const find = vi.fn().mockResolvedValue([audio]);

    const run = {
      stages: [{
        blocksByRef: {
          'block-1': { audio: audioId },
          'block-2': { audio: null }
        }
      }]
    };

    const result = await populateRun({ run }, { models: { Asset: { find } } });

    expect(result.stages[0].blocksByRef['block-1'].audio).toBe(audio);
    expect(result.stages[0].blocksByRef['block-2'].audio).toBeUndefined();
  });

  it('queries Asset.find with only the non-null audio ids', async () => {
    const audioId = buildAudioId('a1');
    const find = vi.fn().mockResolvedValue([]);

    const run = {
      stages: [{
        blocksByRef: {
          'block-1': { audio: audioId },
          'block-2': { audio: null }
        }
      }]
    };

    await populateRun({ run }, { models: { Asset: { find } } });

    expect(find).toHaveBeenCalledWith({ _id: { $in: [audioId] } });
  });

  it('handles multiple stages independently', async () => {
    const audioId1 = buildAudioId('a1');
    const audioId2 = buildAudioId('a2');
    const audio1 = { _id: audioId1 };
    const audio2 = { _id: audioId2 };

    const find = vi.fn()
      .mockResolvedValueOnce([audio1])
      .mockResolvedValueOnce([audio2]);

    const run = {
      stages: [
        { blocksByRef: { b1: { audio: audioId1 } } },
        { blocksByRef: { b2: { audio: audioId2 } } }
      ]
    };

    const result = await populateRun({ run }, { models: { Asset: { find } } });

    expect(result.stages[0].blocksByRef.b1.audio).toBe(audio1);
    expect(result.stages[1].blocksByRef.b2.audio).toBe(audio2);
    expect(find).toHaveBeenCalledTimes(2);
  });

  it('returns the same run instance', async () => {
    const find = vi.fn().mockResolvedValue([]);
    const run = { stages: [] };

    const result = await populateRun({ run }, { models: { Asset: { find } } });

    expect(result).toBe(run);
  });
});
