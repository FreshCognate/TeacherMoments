import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { sendEmailMock, validateOtpRateLimitMock, randomIntMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
  validateOtpRateLimitMock: vi.fn(),
  randomIntMock: vi.fn()
}));

vi.mock('#core/mailer/helpers/sendEmail.js', () => ({ default: (...args) => sendEmailMock(...args) }));
vi.mock('../services/validateOtpRateLimit.js', () => ({ default: (...args) => validateOtpRateLimitMock(...args) }));
vi.mock('crypto', () => ({ default: { randomInt: (...args) => randomIntMock(...args) } }));

import requestOtp from '../services/requestOtp.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildUser = (overrides = {}) => ({
  _id: 'user-1',
  email: 'sam@example.com',
  firstName: 'Sam',
  username: 'sam',
  ...overrides
});

const buildContext = (user) => ({
  models: {
    User: {
      findOne: vi.fn(() => ({ select: vi.fn().mockResolvedValue(user) })),
      findByIdAndUpdate: vi.fn().mockResolvedValue({})
    }
  }
});

describe('requestOtp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
    randomIntMock.mockReturnValue(123456);
    validateOtpRateLimitMock.mockResolvedValue(true);
    sendEmailMock.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 404 when no user matches the lowercased email', async () => {
    const context = {
      models: { User: { findOne: vi.fn(() => ({ select: vi.fn().mockResolvedValue(null) })) } }
    };

    await expect(requestOtp({ email: 'unknown@example.com' }, context))
      .rejects.toMatchObject({ statusCode: 404, message: 'User not found' });
  });

  it('lowercases the email when finding the user', async () => {
    const context = buildContext(buildUser());
    await requestOtp({ email: 'Sam@EXAMPLE.com' }, context);
    expect(context.models.User.findOne).toHaveBeenCalledWith({
      email: 'sam@example.com',
      isDeleted: false
    });
  });

  it('runs the rate limit validation before generating an OTP', async () => {
    const context = buildContext(buildUser());
    validateOtpRateLimitMock.mockRejectedValue({ statusCode: 429, message: 'rate limited' });

    await expect(requestOtp({ email: 'sam@example.com' }, context))
      .rejects.toMatchObject({ statusCode: 429 });

    expect(sendEmailMock).not.toHaveBeenCalled();
    expect(context.models.User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('persists a new OTP code on the user', async () => {
    const context = buildContext(buildUser());

    await requestOtp({ email: 'sam@example.com' }, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      otpCode: '123456',
      otpAttempts: 0,
      otpRequestCount: 1,
      otpGeneratedAt: expect.any(Date)
    }));
  });

  it('starts a fresh request count when the previous OTP was generated more than 15 minutes ago', async () => {
    const context = buildContext(buildUser({
      otpRequestCount: 4,
      otpGeneratedAt: new Date(FIXED_NOW.getTime() - 20 * 60 * 1000)
    }));

    await requestOtp({ email: 'sam@example.com' }, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      otpRequestCount: 1
    }));
  });

  it('increments the request count when within the 15-minute window', async () => {
    const context = buildContext(buildUser({
      otpRequestCount: 2,
      otpGeneratedAt: new Date(FIXED_NOW.getTime() - 5 * 60 * 1000)
    }));

    await requestOtp({ email: 'sam@example.com' }, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      otpRequestCount: 3
    }));
  });

  it('sends the login email with the user name and OTP code', async () => {
    const context = buildContext(buildUser({ firstName: 'Alex' }));

    await requestOtp({ email: 'sam@example.com' }, context);

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: 'sam@example.com',
      templateAlias: 'login',
      templateModel: {
        name: 'Alex',
        otpCode: '123456',
        expiryMinutes: 10
      }
    });
  });

  it('falls back to the username when no firstName is set', async () => {
    const context = buildContext(buildUser({ firstName: null, username: 'samurai' }));

    await requestOtp({ email: 'sam@example.com' }, context);

    expect(sendEmailMock).toHaveBeenCalledWith(expect.objectContaining({
      templateModel: expect.objectContaining({ name: 'samurai' })
    }));
  });

  it('returns success with the lowercased email', async () => {
    const context = buildContext(buildUser());
    const result = await requestOtp({ email: 'Sam@example.com' }, context);
    expect(result).toEqual({ message: 'OTP sent successfully', email: 'sam@example.com' });
  });
});
