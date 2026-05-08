import { describe, it, expect, vi } from 'vitest';
import getTagById from '../services/getTagById.js';

describe('getTagById', () => {
  it('returns the tag when found', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 't1', name: 'A tag' });

    const result = await getTagById({ tagId: 't1' }, {}, { models: { Tag: { findById } } });

    expect(findById).toHaveBeenCalledWith('t1');
    expect(result).toEqual({ _id: 't1', name: 'A tag' });
  });

  it('throws 404 when not found', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(
      getTagById({ tagId: 't1' }, {}, { models: { Tag: { findById } } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
