import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import deleteTagById from '../services/deleteTagById.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('deleteTagById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('soft-deletes the tag and stamps the deletion fields', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 't1', isDeleted: true });

    const result = await deleteTagById(
      { tagId: 't1' },
      {},
      { models: { Tag: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      't1',
      { isDeleted: true, deletedAt: FIXED_NOW, deletedBy: 'u1' },
      { new: true }
    );
    expect(result).toEqual({ _id: 't1', isDeleted: true });
  });

  it('throws 404 when the tag does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      deleteTagById({ tagId: 't1' }, {}, { models: { Tag: { findByIdAndUpdate } }, user: { _id: 'u1' } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
