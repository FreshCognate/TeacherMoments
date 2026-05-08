import { describe, it, expect, vi } from 'vitest';
import createTag from '../services/createTag.js';

describe('createTag', () => {
  it('throws 400 when no name is provided', async () => {
    const create = vi.fn();

    await expect(
      createTag({ tagType: 'CATEGORY' }, {}, { models: { Tag: { create } }, user: { _id: 'u1' } })
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(create).not.toHaveBeenCalled();
  });

  it('creates a tag stamped with the current user', async () => {
    const create = vi.fn().mockResolvedValue({ _id: 't1' });

    const result = await createTag(
      { name: 'New tag', tagType: 'CATEGORY' },
      {},
      { models: { Tag: { create } }, user: { _id: 'u1' } }
    );

    expect(create).toHaveBeenCalledWith({
      name: 'New tag',
      tagType: 'CATEGORY',
      createdBy: 'u1'
    });
    expect(result).toEqual({ _id: 't1' });
  });
});
