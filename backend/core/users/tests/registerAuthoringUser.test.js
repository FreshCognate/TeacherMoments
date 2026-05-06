import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { uuidV4Mock } = vi.hoisted(() => ({
  uuidV4Mock: vi.fn()
}));

vi.mock('node-uuid', () => ({
  default: { v4: () => uuidV4Mock() }
}));

import registerAuthoringUser from '../services/registerAuthoringUser.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('registerAuthoringUser', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
    uuidV4Mock.mockReturnValue('uuid-1234');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 400 when the email already exists', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue({ _id: 'existing' }),
        create: vi.fn()
      }
    };

    await expect(registerAuthoringUser(
      { email: 'sam@example.com', role: 'ADMIN' },
      {},
      { models }
    )).rejects.toMatchObject({ statusCode: 400, message: 'This user already exists.' });

    expect(models.User.create).not.toHaveBeenCalled();
  });

  it('lowercases the email when looking up and creating the user', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ _id: 'u1' })
      }
    };

    await registerAuthoringUser(
      { email: 'Sam@EXAMPLE.com', role: 'ADMIN' },
      {},
      { models }
    );

    expect(models.User.findOne).toHaveBeenCalledWith({ email: 'sam@example.com' });
    expect(models.User.create).toHaveBeenCalledWith(expect.objectContaining({
      email: 'sam@example.com',
      role: 'ADMIN'
    }));
  });

  it('persists registration metadata (registrationId, registeredAt, createdAt)', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ _id: 'u1' })
      }
    };

    await registerAuthoringUser(
      { email: 'sam@example.com', role: 'ADMIN' },
      {},
      { models }
    );

    expect(models.User.create).toHaveBeenCalledWith({
      email: 'sam@example.com',
      role: 'ADMIN',
      createdAt: FIXED_NOW,
      registrationId: 'uuid-1234',
      registeredAt: FIXED_NOW
    });
  });

  it('returns the created user', async () => {
    const created = { _id: 'u1' };
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(created)
      }
    };

    const result = await registerAuthoringUser(
      { email: 'sam@example.com', role: 'ADMIN' },
      {},
      { models }
    );

    expect(result).toBe(created);
  });
});
