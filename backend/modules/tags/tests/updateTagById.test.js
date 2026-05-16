import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import updateTagById from '../services/updateTagById.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('updateTagById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('mutates the update with updatedBy/updatedAt and applies it', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 't1', name: 'Renamed' });

    const result = await updateTagById(
      { tagId: 't1', update: { name: 'Renamed' } },
      {},
      { models: { Tag: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      't1',
      { name: 'Renamed', updatedBy: 'u1', updatedAt: FIXED_NOW },
      { new: true }
    );
    expect(result).toEqual({ _id: 't1', name: 'Renamed' });
  });

  it('throws 404 when the tag does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      updateTagById(
        { tagId: 't1', update: {} },
        {},
        { models: { Tag: { findByIdAndUpdate } }, user: { _id: 'u1' } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
