import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { sendEmailMock, validateOtpRateLimitMock, randomIntMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
  validateOtpRateLimitMock: vi.fn(),
  randomIntMock: vi.fn()
}));

vi.mock('#core/mailer/helpers/sendEmail.js', () => ({ default: (...args) => sendEmailMock(...args) }));
vi.mock('#core/authentication/services/validateOtpRateLimit.js', () => ({ default: (...args) => validateOtpRateLimitMock(...args) }));
vi.mock('crypto', () => ({ default: { randomInt: (...args) => randomIntMock(...args) } }));

import resendVerificationCode from '../services/resendVerificationCode.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildContext = (user) => ({
  models: {
    User: {
      findOne: vi.fn(() => ({ select: vi.fn().mockResolvedValue(user) })),
      findByIdAndUpdate: vi.fn().mockResolvedValue({})
    }
  }
});

describe('resendVerificationCode (users)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.clearAllMocks();
    randomIntMock.mockReturnValue(987654);
    validateOtpRateLimitMock.mockResolvedValue(true);
    sendEmailMock.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 400 when no unverified user exists', async () => {
    const context = {
      models: { User: { findOne: vi.fn(() => ({ select: vi.fn().mockResolvedValue(null) })) } }
    };

    await expect(resendVerificationCode({ email: 'sam@example.com' }, {}, context))
      .rejects.toMatchObject({ statusCode: 400, message: 'User not found or already verified' });
  });

  it('searches for unverified users by lowercased email', async () => {
    const context = buildContext({ _id: 'u1', email: 'sam@example.com', username: 'sam' });

    await resendVerificationCode({ email: 'Sam@EXAMPLE.com' }, {}, context);

    expect(context.models.User.findOne).toHaveBeenCalledWith({
      email: 'sam@example.com',
      isVerified: false
    });
  });

  it('starts a new request count when the previous OTP was generated more than 15 minutes ago', async () => {
    const context = buildContext({
      _id: 'u1',
      email: 'sam@example.com',
      username: 'sam',
      otpRequestCount: 4,
      otpGeneratedAt: new Date(FIXED_NOW.getTime() - 20 * 60 * 1000)
    });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('u1', expect.objectContaining({
      otpRequestCount: 1
    }));
  });

  it('increments the request count when within the window', async () => {
    const context = buildContext({
      _id: 'u1',
      email: 'sam@example.com',
      username: 'sam',
      otpRequestCount: 2,
      otpGeneratedAt: new Date(FIXED_NOW.getTime() - 5 * 60 * 1000)
    });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('u1', expect.objectContaining({
      otpRequestCount: 3
    }));
  });

  it('refuses to send when rate limit fails', async () => {
    const context = buildContext({ _id: 'u1', email: 'sam@example.com', username: 'sam' });
    validateOtpRateLimitMock.mockRejectedValue({ statusCode: 429, message: 'limited' });

    await expect(resendVerificationCode({ email: 'sam@example.com' }, {}, context))
      .rejects.toMatchObject({ statusCode: 429 });

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('sends a resend-otp email with the username (or fallback "User")', async () => {
    const context = buildContext({ _id: 'u1', email: 'sam@example.com', username: 'sam' });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, context);

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: 'sam@example.com',
      templateAlias: 'resend-otp',
      templateModel: { name: 'sam', otpCode: '987654', expiryMinutes: 10 }
    });
  });

  it('falls back to "User" as the template name when username is null', async () => {
    const context = buildContext({ _id: 'u1', email: 'sam@example.com', username: null });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, context);

    expect(sendEmailMock).toHaveBeenCalledWith(expect.objectContaining({
      templateModel: expect.objectContaining({ name: 'User' })
    }));
  });

  it('returns success with the user email', async () => {
    const context = buildContext({ _id: 'u1', email: 'sam@example.com', username: 'sam' });

    const result = await resendVerificationCode({ email: 'sam@example.com' }, {}, context);

    expect(result).toEqual({ message: 'OTP sent successfully', email: 'sam@example.com' });
  });
});
