import { describe, it, expect, vi } from 'vitest';
import getUserById from '../services/getUserById.js';

describe('getUserById', () => {
  it('finds the user by id', async () => {
    const user = { _id: 'u1', role: 'PARTICIPANT' };
    const findById = vi.fn().mockResolvedValue(user);

    const result = await getUserById(
      { userId: 'u1' },
      {},
      { user: { _id: 'admin-1', role: 'ADMIN' }, models: { User: { findById } } }
    );

    expect(findById).toHaveBeenCalledWith('u1');
    expect(result).toBe(user);
  });

  it('throws 404 when the user does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(getUserById(
      { userId: 'missing' },
      {},
      { user: { _id: 'admin-1', role: 'ADMIN' }, models: { User: { findById } } }
    )).rejects.toMatchObject({ statusCode: 404 });
  });

  it('throws 401 when an ADMIN reads a SUPER_ADMIN', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 'super', role: 'SUPER_ADMIN' });

    await expect(getUserById(
      { userId: 'super' },
      {},
      { user: { _id: 'admin-1', role: 'ADMIN' }, models: { User: { findById } } }
    )).rejects.toMatchObject({ statusCode: 401 });
  });

  it('allows a SUPER_ADMIN to read a SUPER_ADMIN', async () => {
    const user = { _id: 'super', role: 'SUPER_ADMIN' };
    const findById = vi.fn().mockResolvedValue(user);

    const result = await getUserById(
      { userId: 'super' },
      {},
      { user: { _id: 'super-2', role: 'SUPER_ADMIN' }, models: { User: { findById } } }
    );

    expect(result).toBe(user);
  });
});
