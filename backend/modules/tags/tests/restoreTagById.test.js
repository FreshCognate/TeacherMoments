import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import restoreTagById from '../services/restoreTagById.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('restoreTagById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clears the deletion fields and stamps the restoring user', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 't1', isDeleted: false });

    const result = await restoreTagById(
      { tagId: 't1' },
      {},
      { models: { Tag: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      't1',
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: FIXED_NOW,
        updatedBy: 'u1'
      },
      { new: true }
    );
    expect(result).toEqual({ _id: 't1', isDeleted: false });
  });

  it('throws 404 when the tag does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(
      restoreTagById({ tagId: 't1' }, {}, { models: { Tag: { findByIdAndUpdate } }, user: { _id: 'u1' } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
