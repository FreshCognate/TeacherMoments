import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { sendEmailMock, validateOtpRateLimitMock, randomIntMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
  validateOtpRateLimitMock: vi.fn(),
  randomIntMock: vi.fn()
}));

vi.mock('#core/mailer/helpers/sendEmail.js', () => ({ default: (...args) => sendEmailMock(...args) }));
vi.mock('../services/validateOtpRateLimit.js', () => ({ default: (...args) => validateOtpRateLimitMock(...args) }));
vi.mock('crypto', () => ({ default: { randomInt: (...args) => randomIntMock(...args) } }));

import requestOtp from '../services/requestOtp.js';

const db = setupMongo();

const NOW = Date.now();

describe('requestOtp (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    randomIntMock.mockReturnValue(123456);
    validateOtpRateLimitMock.mockResolvedValue(true);
    sendEmailMock.mockResolvedValue({});
  });

  it('throws 404 when no user matches the lowercased email', async () => {
    await expect(
      requestOtp({ email: 'unknown@example.com' }, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 404, message: 'User not found' });
  });

  it('refuses to generate an OTP when the rate limit validation fails', async () => {
    await db.models.User.create({ email: 'sam@example.com', firstName: 'Sam' });
    validateOtpRateLimitMock.mockRejectedValue({ statusCode: 429, message: 'rate limited' });

    await expect(
      requestOtp({ email: 'sam@example.com' }, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 429 });

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('persists a new OTP on the user (email lowercased) and sends the login email', async () => {
    const user = await db.models.User.create({ email: 'sam@example.com', firstName: 'Alex' });

    const result = await requestOtp({ email: 'Sam@EXAMPLE.com' }, { models: db.models });

    const stored = await db.models.User.findById(user._id).select('+otpCode').lean();
    expect(stored.otpCode).toBe('123456');
    expect(stored.otpAttempts).toBe(0);
    expect(stored.otpRequestCount).toBe(1);

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: 'sam@example.com',
      templateAlias: 'login',
      templateModel: { name: 'Alex', otpCode: '123456', expiryMinutes: 10 }
    });
    expect(result).toEqual({ message: 'OTP sent successfully', email: 'sam@example.com' });
  });

  it('starts a fresh request count when the previous OTP was generated more than 15 minutes ago', async () => {
    const user = await db.models.User.create({
      email: 'sam@example.com', firstName: 'Sam',
      otpRequestCount: 4, otpGeneratedAt: new Date(NOW - 20 * 60 * 1000)
    });

    await requestOtp({ email: 'sam@example.com' }, { models: db.models });

    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.otpRequestCount).toBe(1);
  });

  it('increments the request count when within the 15-minute window', async () => {
    const user = await db.models.User.create({
      email: 'sam@example.com', firstName: 'Sam',
      otpRequestCount: 2, otpGeneratedAt: new Date(NOW - 5 * 60 * 1000)
    });

    await requestOtp({ email: 'sam@example.com' }, { models: db.models });

    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.otpRequestCount).toBe(3);
  });

  it('falls back to the username when no firstName is set', async () => {
    await db.models.User.create({ email: 'sam@example.com', username: 'samurai' });

    await requestOtp({ email: 'sam@example.com' }, { models: db.models });

    expect(sendEmailMock).toHaveBeenCalledWith(expect.objectContaining({
      templateModel: expect.objectContaining({ name: 'samurai' })
    }));
  });
});
