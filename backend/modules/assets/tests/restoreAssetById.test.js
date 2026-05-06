import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import restoreAssetById from '../services/restoreAssetById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('restoreAssetById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('restores the asset with cleared deletion fields and updatedAt/updatedBy', async () => {
    const restored = { _id: 'a1', isDeleted: false };
    const findByIdAndUpdate = vi.fn().mockResolvedValue(restored);

    const result = await restoreAssetById(
      { assetId: 'a1' },
      {},
      { user: { _id: 'u1' }, models: { Asset: { findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('a1', {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      updatedAt: FIXED_NOW,
      updatedBy: 'u1'
    }, { new: true });
    expect(result).toBe(restored);
  });

  it('throws 404 when the asset does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(restoreAssetById(
      { assetId: 'missing' },
      {},
      { user: { _id: 'u1' }, models: { Asset: { findByIdAndUpdate } } }
    )).rejects.toMatchObject({ statusCode: 404, message: 'This asset does not exist' });
  });
});
