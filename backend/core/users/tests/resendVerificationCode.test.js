import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { sendEmailMock, validateOtpRateLimitMock, randomIntMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
  validateOtpRateLimitMock: vi.fn(),
  randomIntMock: vi.fn()
}));

vi.mock('#core/mailer/helpers/sendEmail.js', () => ({ default: (...args) => sendEmailMock(...args) }));
vi.mock('#core/authentication/services/validateOtpRateLimit.js', () => ({ default: (...args) => validateOtpRateLimitMock(...args) }));
vi.mock('crypto', () => ({ default: { randomInt: (...args) => randomIntMock(...args) } }));

import resendVerificationCode from '../services/resendVerificationCode.js';

const db = setupMongo();

const NOW = Date.now();

describe('resendVerificationCode (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    randomIntMock.mockReturnValue(987654);
    validateOtpRateLimitMock.mockResolvedValue(true);
    sendEmailMock.mockResolvedValue({});
  });

  it('throws 400 when no unverified user exists', async () => {
    await expect(
      resendVerificationCode({ email: 'sam@example.com' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 400, message: 'User not found or already verified' });
  });

  it('finds the unverified user by lowercased email and sends a resend-otp email', async () => {
    await db.models.User.create({ email: 'sam@example.com', username: 'sam', isVerified: false });

    const result = await resendVerificationCode({ email: 'Sam@EXAMPLE.com' }, {}, { models: db.models });

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: 'sam@example.com',
      templateAlias: 'resend-otp',
      templateModel: { name: 'sam', otpCode: '987654', expiryMinutes: 10 }
    });
    expect(result).toEqual({ message: 'OTP sent successfully', email: 'sam@example.com' });
  });

  it('starts a new request count when the previous OTP was generated more than 15 minutes ago', async () => {
    const user = await db.models.User.create({
      email: 'sam@example.com', username: 'sam', isVerified: false,
      otpRequestCount: 4, otpGeneratedAt: new Date(NOW - 20 * 60 * 1000)
    });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, { models: db.models });

    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.otpRequestCount).toBe(1);
  });

  it('increments the request count when within the window', async () => {
    const user = await db.models.User.create({
      email: 'sam@example.com', username: 'sam', isVerified: false,
      otpRequestCount: 2, otpGeneratedAt: new Date(NOW - 5 * 60 * 1000)
    });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, { models: db.models });

    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.otpRequestCount).toBe(3);
  });

  it('refuses to send when the rate limit fails', async () => {
    await db.models.User.create({ email: 'sam@example.com', username: 'sam', isVerified: false });
    validateOtpRateLimitMock.mockRejectedValue({ statusCode: 429, message: 'limited' });

    await expect(
      resendVerificationCode({ email: 'sam@example.com' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 429 });

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('falls back to "User" as the template name when username is null', async () => {
    await db.models.User.create({ email: 'sam@example.com', isVerified: false });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, { models: db.models });

    expect(sendEmailMock).toHaveBeenCalledWith(expect.objectContaining({
      templateModel: expect.objectContaining({ name: 'User' })
    }));
  });
});
