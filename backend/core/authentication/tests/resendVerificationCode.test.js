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

const buildUser = (overrides = {}) => ({
  _id: 'user-1',
  email: 'sam@example.com',
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

describe('resendVerificationCode', () => {
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

  it('throws 400 when the user does not exist or is already verified', async () => {
    const context = {
      models: { User: { findOne: vi.fn(() => ({ select: vi.fn().mockResolvedValue(null) })) } }
    };

    await expect(resendVerificationCode({ email: 'sam@example.com' }, {}, context))
      .rejects.toMatchObject({ statusCode: 400, message: 'User not found or already verified' });
  });

  it('looks up only unverified, non-deleted users', async () => {
    const context = buildContext(buildUser());
    await resendVerificationCode({ email: 'Sam@EXAMPLE.com' }, {}, context);

    expect(context.models.User.findOne).toHaveBeenCalledWith({
      email: 'sam@example.com',
      isVerified: false,
      isDeleted: false
    });
  });

  it('starts a new request window when the previous one has expired', async () => {
    const context = buildContext(buildUser({
      otpRequestCount: 3,
      otpRequestWindowStart: new Date(FIXED_NOW.getTime() - 20 * 60 * 1000)
    }));

    await resendVerificationCode({ email: 'sam@example.com' }, {}, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      otpRequestCount: 1,
      otpRequestWindowStart: FIXED_NOW
    }));
  });

  it('increments the request count when within the window', async () => {
    const context = buildContext(buildUser({
      otpRequestCount: 2,
      otpRequestWindowStart: new Date(FIXED_NOW.getTime() - 5 * 60 * 1000)
    }));

    await resendVerificationCode({ email: 'sam@example.com' }, {}, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      otpRequestCount: 3
    }));
  });

  it('sends the resend-otp template with the username', async () => {
    const context = buildContext(buildUser({ username: 'sam-the-user' }));

    await resendVerificationCode({ email: 'sam@example.com' }, {}, context);

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: 'sam@example.com',
      templateAlias: 'resend-otp',
      templateModel: {
        name: 'sam-the-user',
        otpCode: '987654',
        expiryMinutes: 10
      }
    });
  });

  it('falls back to "User" when no username is set', async () => {
    const context = buildContext(buildUser({ username: null }));

    await resendVerificationCode({ email: 'sam@example.com' }, {}, context);

    expect(sendEmailMock).toHaveBeenCalledWith(expect.objectContaining({
      templateModel: expect.objectContaining({ name: 'User' })
    }));
  });

  it('refuses to send when the rate limit fails', async () => {
    const context = buildContext(buildUser());
    validateOtpRateLimitMock.mockRejectedValue({ statusCode: 429, message: 'limited' });

    await expect(resendVerificationCode({ email: 'sam@example.com' }, {}, context))
      .rejects.toMatchObject({ statusCode: 429 });

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('returns success with the user email', async () => {
    const context = buildContext(buildUser({ email: 'sam@example.com' }));
    const result = await resendVerificationCode({ email: 'sam@example.com' }, {}, context);
    expect(result).toEqual({ message: 'OTP sent successfully', email: 'sam@example.com' });
  });
});
