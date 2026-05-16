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
    const findByIdAndUpdate = vi.fn().mockResolvedValue(updated);

    const result = await deleteUserById(
      { userId: 'u1' },
      {},
      { user: { _id: 'admin-1' }, models: { User: { findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('u1', {
      isDeleted: true,
      deletedAt: FIXED_NOW,
      deletedBy: 'admin-1'
    }, { new: true });
    expect(result).toBe(updated);
  });
});
