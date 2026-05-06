import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import restoreUserById from '../services/restoreUserById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('restoreUserById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('restores a user when called by an ADMIN', async () => {
    const updated = { _id: 'u1', isDeleted: false };
    const findByIdAndUpdate = vi.fn().mockResolvedValue(updated);

    const result = await restoreUserById(
      { userId: 'u1' },
      {},
      { user: { _id: 'admin-1', role: 'ADMIN' }, models: { User: { findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalledWith('u1', {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      updatedBy: 'admin-1',
      updatedAt: FIXED_NOW
    }, { new: true });
    expect(result).toBe(updated);
  });

  it('throws 401 when a non-admin tries to restore another user', async () => {
    const findByIdAndUpdate = vi.fn();

    await expect(restoreUserById(
      { userId: 'u-other' },
      {},
      { user: { _id: 'u-self', role: 'USER' }, models: { User: { findByIdAndUpdate } } }
    )).rejects.toMatchObject({
      statusCode: 401,
      message: "User doesn't have correct permissions"
    });

    expect(findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('allows a non-admin to restore themselves', async () => {
    const updated = { _id: 'u-self' };
    const findByIdAndUpdate = vi.fn().mockResolvedValue(updated);

    const result = await restoreUserById(
      { userId: 'u-self' },
      {},
      { user: { _id: 'u-self', role: 'USER' }, models: { User: { findByIdAndUpdate } } }
    );

    expect(result).toBe(updated);
  });

  it('allows a SUPER_ADMIN to restore any user', async () => {
    const findByIdAndUpdate = vi.fn().mockResolvedValue({});

    await restoreUserById(
      { userId: 'u-other' },
      {},
      { user: { _id: 'super', role: 'SUPER_ADMIN' }, models: { User: { findByIdAndUpdate } } }
    );

    expect(findByIdAndUpdate).toHaveBeenCalled();
  });
});
