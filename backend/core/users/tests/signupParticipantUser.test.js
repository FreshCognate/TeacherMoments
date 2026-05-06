import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { sendEmailMock, randomIntMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
  randomIntMock: vi.fn()
}));

vi.mock('#core/mailer/helpers/sendEmail.js', () => ({ default: (...args) => sendEmailMock(...args) }));
vi.mock('crypto', () => ({ default: { randomInt: (...args) => randomIntMock(...args) } }));

import signupParticipantUser from '../services/signupParticipantUser.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('signupParticipantUser', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
    randomIntMock.mockReturnValue(123456);
    sendEmailMock.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 400 when username is shorter than 6 characters', async () => {
    await expect(signupParticipantUser(
      { username: 'sam', email: 'sam@example.com' },
      {},
      { models: {} }
    )).rejects.toMatchObject({
      statusCode: 400,
      message: 'Username must be at least 6 characters'
    });
  });

  it('throws 400 when the email is invalid', async () => {
    await expect(signupParticipantUser(
      { username: 'sammy123', email: 'not-an-email' },
      {},
      { models: {} }
    )).rejects.toMatchObject({
      statusCode: 400,
      message: 'Email is not valid'
    });
  });

  it('throws 400 when a user with the email or username exists', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue({ _id: 'existing' }),
        create: vi.fn()
      }
    };

    await expect(signupParticipantUser(
      { username: 'sammy123', email: 'sam@example.com' },
      {},
      { models }
    )).rejects.toMatchObject({
      statusCode: 400,
      message: 'This user already exists. Try another username or email.'
    });

    expect(models.User.create).not.toHaveBeenCalled();
  });

  it('searches by both email (lowercased) and username', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ _id: 'u1' })
      }
    };

    await signupParticipantUser(
      { username: 'sammy123', email: 'Sam@EXAMPLE.com' },
      {},
      { models }
    );

    expect(models.User.findOne).toHaveBeenCalledWith({
      $or: [{ email: 'sam@example.com' }, { username: 'sammy123' }]
    });
  });

  it('creates a participant user with PARTICIPANT role and an OTP', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ _id: 'u1' })
      }
    };

    await signupParticipantUser(
      { username: 'sammy123', email: 'sam@example.com' },
      {},
      { models }
    );

    expect(models.User.create).toHaveBeenCalledWith({
      username: 'sammy123',
      email: 'sam@example.com',
      role: 'PARTICIPANT',
      otpCode: '123456',
      otpAttempts: 0,
      otpRequestCount: 1,
      otpGeneratedAt: FIXED_NOW,
      isVerified: false,
      createdAt: FIXED_NOW
    });
  });

  it('sends a signup email with the OTP code and username', async () => {
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ _id: 'u1' })
      }
    };

    await signupParticipantUser(
      { username: 'sammy123', email: 'sam@example.com' },
      {},
      { models }
    );

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: 'sam@example.com',
      templateAlias: 'signup',
      templateModel: {
        name: 'sammy123',
        otpCode: '123456',
        expiryMinutes: 10
      }
    });
  });

  it('returns the created user wrapped under "user"', async () => {
    const created = { _id: 'u1', username: 'sammy123' };
    const models = {
      User: {
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(created)
      }
    };

    const result = await signupParticipantUser(
      { username: 'sammy123', email: 'sam@example.com' },
      {},
      { models }
    );

    expect(result).toEqual({ user: created });
  });
});
