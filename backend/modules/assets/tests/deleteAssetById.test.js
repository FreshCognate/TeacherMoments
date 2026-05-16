import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import deleteAssetById from '../services/deleteAssetById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('deleteAssetById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 401 when the asset is not owned by the user', async () => {
    const findOne = vi.fn().mockResolvedValue(null);
    const findByIdAndUpdate = vi.fn();

    await expect(deleteAssetById(
      { assetId: 'a1' },
      {},
      { user: { _id: 'u1' }, models: { Asset: { findOne, findByIdAndUpdate } } }
    )).rejects.toMatchObject({ statusCode: 401, message: 'You do not have permissions to delete this asset' });

    expect(findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('looks up the asset by id and createdBy', async () => {
    const findOne = vi.fn().mockResolvedValue({ _id: 'a1' });
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'a1', isDeleted: true });

    await deleteAssetById(
      { assetId: 'a1' },
      {},
      { user: { _id: 'u1' }, models: { Asset: { findOne, findByIdAndUpdate } } }
    );

    expect(findOne).toHaveBeenCalledWith({ _id: 'a1', createdBy: 'u1' });
  });

  it('soft-deletes with deletedAt and deletedBy when found', async () => {
    const findOne = vi.fn().mockResolvedValue({ _id: 'a1' });
    const findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'a1', isDeleted: true });

    await deleteAssetById(
      { assetId: 'a1' },
      {},
      { user: { _id: 'u1' }, models: { Asset: { findOne, findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('a1', {
      isDeleted: true,
      deletedAt: FIXED_NOW,
      deletedBy: 'u1'
    }, { new: true });
  });

  it('returns the updated asset', async () => {
    const findOne = vi.fn().mockResolvedValue({ _id: 'a1' });
    const updated = { _id: 'a1', isDeleted: true };
    const findByIdAndUpdate = vi.fn().mockResolvedValue(updated);

    const result = await deleteAssetById(
      { assetId: 'a1' },
      {},
      { user: { _id: 'u1' }, models: { Asset: { findOne, findByIdAndUpdate } } }
    );

    expect(result).toBe(updated);
  });
});
