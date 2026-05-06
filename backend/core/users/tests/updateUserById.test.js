import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import updateUserById from '../services/updateUserById.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('updateUserById', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 401 when a non-admin tries to update another user', async () => {
    const models = {
      User: { findOne: vi.fn(), findByIdAndUpdate: vi.fn() }
    };

    await expect(updateUserById(
      { userId: 'u-other', update: { firstName: 'Sam' } },
      {},
      { user: { _id: 'u-self', role: 'USER' }, models }
    )).rejects.toMatchObject({ statusCode: 401 });

    expect(models.User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('allows a non-admin to update themselves', async () => {
    const models = {
      User: {
        findOne: vi.fn(),
        findByIdAndUpdate: vi.fn().mockResolvedValue({ _id: 'u-self', firstName: 'Sam' })
      }
    };

    const result = await updateUserById(
      { userId: 'u-self', update: { firstName: 'Sam' } },
      {},
      { user: { _id: 'u-self', role: 'USER' }, models }
    );

    expect(result.firstName).toBe('Sam');
  });

  it('lowercases an email when set in the update', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue(null),
        findByIdAndUpdate: vi.fn().mockResolvedValue({})
      }
    };

    await updateUserById(
      { userId: 'u1', update: { email: 'Sam@EXAMPLE.com' } },
      {},
      { user: { _id: 'admin-1', role: 'ADMIN' }, models }
    );

    expect(models.User.findOne).toHaveBeenCalledWith({ email: 'sam@example.com', _id: { $ne: 'u1' } });
    expect(models.User.findByIdAndUpdate.mock.calls[0][1].email).toBe('sam@example.com');
  });

  it('throws 400 when another user already owns the email', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue({ _id: 'u-other' }),
        findByIdAndUpdate: vi.fn()
      }
    };

    await expect(updateUserById(
      { userId: 'u1', update: { email: 'taken@example.com' } },
      {},
      { user: { _id: 'admin', role: 'ADMIN' }, models }
    )).rejects.toMatchObject({
      statusCode: 400,
      message: 'A user with this email already exists.'
    });

    expect(models.User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('stamps updatedAt on the update', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue(null),
        findByIdAndUpdate: vi.fn().mockResolvedValue({})
      }
    };

    await updateUserById(
      { userId: 'u1', update: { firstName: 'Sam' } },
      {},
      { user: { _id: 'admin', role: 'ADMIN' }, models }
    );

    expect(models.User.findByIdAndUpdate.mock.calls[0][1].updatedAt).toEqual(FIXED_NOW);
  });
});
