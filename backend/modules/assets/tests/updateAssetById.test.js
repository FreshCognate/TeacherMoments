import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import updateAssetById from '../services/updateAssetById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('updateAssetById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('applies the update with updatedAt and updatedBy', async () => {
    const updated = { _id: 'a1', name: 'new' };
    const findByIdAndUpdate = vi.fn().mockResolvedValue(updated);

    const result = await updateAssetById(
      { assetId: 'a1', update: { name: 'new' } },
      {},
      { user: { _id: 'u1' }, models: { Asset: { findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('a1', expect.objectContaining({
      name: 'new',
      updatedBy: 'u1',
      updatedAt: FIXED_NOW
    }), { new: true });
    expect(result).toBe(updated);
  });

  it('throws 404 when the asset does not exist', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue(null);

    await expect(updateAssetById(
      { assetId: 'missing', update: {} },
      {},
      { user: { _id: 'u1' }, models: { Asset: { findByIdAndUpdate } } }
    )).rejects.toMatchObject({ statusCode: 404, message: 'This asset does not exist' });
  });
});
