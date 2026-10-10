import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import deleteUserById from '../services/deleteUserById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('deleteUserById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('soft-deletes the user with deletedAt and deletedBy', async () => {
    const updated = { _id: 'u1', isDeleted: true };
    const findById = vi.fn().mockResolvedValue({ _id: 'u1', role: 'PARTICIPANT' });
    const findByIdAndUpdate = vi.fn().mockResolvedValue(updated);

    const result = await deleteUserById(
      { userId: 'u1' },
      {},
      { user: { _id: 'admin-1', role: 'ADMIN' }, models: { User: { findById, findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('u1', {
      isDeleted: true,
      deletedAt: FIXED_NOW,
      deletedBy: 'admin-1'
    }, { new: true });
    expect(result).toBe(updated);
  });

  it('throws 404 when the user does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);
    const findByIdAndUpdate = vi.fn();

    await expect(deleteUserById(
      { userId: 'missing' },
      {},
      { user: { _id: 'admin-1', role: 'ADMIN' }, models: { User: { findById, findByIdAndUpdate } } }
    )).rejects.toMatchObject({ statusCode: 404 });

    expect(findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('throws 401 when an ADMIN deletes a SUPER_ADMIN', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 'super', role: 'SUPER_ADMIN' });
    const findByIdAndUpdate = vi.fn();

    await expect(deleteUserById(
      { userId: 'super' },
      {},
      { user: { _id: 'admin-1', role: 'ADMIN' }, models: { User: { findById, findByIdAndUpdate } } }
    )).rejects.toMatchObject({ statusCode: 401 });

    expect(findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('allows a SUPER_ADMIN to delete a SUPER_ADMIN', async () => {
    const findById = vi.fn().mockResolvedValue({ _id: 'super', role: 'SUPER_ADMIN' });
    const findByIdAndUpdate = vi.fn().mockResolvedValue({});

    await deleteUserById(
      { userId: 'super' },
      {},
      { user: { _id: 'super-2', role: 'SUPER_ADMIN' }, models: { User: { findById, findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalled();
  });
});
