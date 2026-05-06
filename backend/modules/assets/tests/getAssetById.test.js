import { describe, it, expect, vi } from 'vitest';
import getAssetById from '../services/getAssetById.js';

describe('getAssetById', () => {
  it('returns the asset when found', async () => {
    const asset = { _id: 'a1', name: 'photo' };
    const findById = vi.fn().mockResolvedValue(asset);

    const result = await getAssetById({ assetId: 'a1' }, {}, { models: { Asset: { findById } } });

    expect(findById).toHaveBeenCalledWith('a1');
    expect(result).toBe(asset);
  });

  it('throws 404 when the asset does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(getAssetById({ assetId: 'missing' }, {}, { models: { Asset: { findById } } }))
      .rejects.toMatchObject({ statusCode: 404, message: 'This asset does not exist' });
  });
});
