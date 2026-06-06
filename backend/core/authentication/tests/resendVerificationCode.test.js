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

describe('resendVerificationCode (auth, in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    randomIntMock.mockReturnValue(987654);
    validateOtpRateLimitMock.mockResolvedValue(true);
    sendEmailMock.mockResolvedValue({});
  });

  it('throws 400 when the user does not exist or is already verified', async () => {
    await db.models.User.create({ email: 'verified@example.com', isVerified: true });

    await expect(
      resendVerificationCode({ email: 'verified@example.com' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 400, message: 'User not found or already verified' });
  });

  it('sends a resend-otp email to an unverified user and persists a fresh OTP', async () => {
    const user = await db.models.User.create({ email: 'sam@example.com', username: 'sam-the-user', isVerified: false });

    const result = await resendVerificationCode({ email: 'Sam@EXAMPLE.com' }, {}, { models: db.models });

    const stored = await db.models.User.findById(user._id).select('+otpCode').lean();
    expect(stored.otpCode).toBe('987654');
    expect(stored.otpRequestCount).toBe(1);

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: 'sam@example.com',
      templateAlias: 'resend-otp',
      templateModel: { name: 'sam-the-user', otpCode: '987654', expiryMinutes: 10 }
    });
    expect(result).toEqual({ message: 'OTP sent successfully', email: 'sam@example.com' });
  });

  it('falls back to "User" when no username is set', async () => {
    await db.models.User.create({ email: 'sam@example.com', isVerified: false });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, { models: db.models });

    expect(sendEmailMock).toHaveBeenCalledWith(expect.objectContaining({
      templateModel: expect.objectContaining({ name: 'User' })
    }));
  });

  it('refuses to send when the rate limit fails', async () => {
    await db.models.User.create({ email: 'sam@example.com', isVerified: false });
    validateOtpRateLimitMock.mockRejectedValue({ statusCode: 429, message: 'limited' });

    await expect(
      resendVerificationCode({ email: 'sam@example.com' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 429 });

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('increments the request count within the 15-minute window and records lastOtpSentAt', async () => {
    const user = await db.models.User.create({
      email: 'sam@example.com',
      isVerified: false,
      otpRequestCount: 2,
      otpRequestWindowStart: new Date(Date.now() - 5 * 60 * 1000)
    });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, { models: db.models });

    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.otpRequestCount).toBe(3);
    expect(stored.otpRequestWindowStart).toBeInstanceOf(Date);
    expect(stored.lastOtpSentAt).toBeInstanceOf(Date);
  });

  it('starts a fresh window when the previous one has expired', async () => {
    const user = await db.models.User.create({
      email: 'sam@example.com',
      isVerified: false,
      otpRequestCount: 4,
      otpRequestWindowStart: new Date(Date.now() - 20 * 60 * 1000)
    });

    await resendVerificationCode({ email: 'sam@example.com' }, {}, { models: db.models });

    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.otpRequestCount).toBe(1);
  });
});
