import { describe, it, expect, vi } from 'vitest';
import getUserById from '../services/getUserById.js';

describe('getUserById', () => {
  it('finds the user by id and populates teams', async () => {
    const populate = vi.fn().mockResolvedValue({ _id: 'u1', teams: ['t1'] });
    const findById = vi.fn(() => ({ populate }));

    const result = await getUserById({ userId: 'u1' }, {}, { models: { User: { findById } } });

    expect(findById).toHaveBeenCalledWith('u1');
    expect(populate).toHaveBeenCalledWith('teams');
    expect(result).toEqual({ _id: 'u1', teams: ['t1'] });
  });
});
