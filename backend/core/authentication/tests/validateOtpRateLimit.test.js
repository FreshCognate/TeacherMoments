import { describe, it, expect, beforeEach } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';
import validateOtpRateLimit from '../services/validateOtpRateLimit.js';

const db = setupMongo();

const NOW = Date.now();

describe('validateOtpRateLimit (in-memory mongo)', () => {
  beforeEach(() => {});

  it('returns true when the user is not locked and has no prior OTP activity', async () => {
    await expect(validateOtpRateLimit({ _id: 'u1' }, db.models)).resolves.toBe(true);
  });

  it('throws 429 (too many attempts) when locked and not expired', async () => {
    const user = { _id: 'u1', isLocked: true, lockedUntil: new Date(NOW + 5 * 60 * 1000), lockReason: 'TOO_MANY_ATTEMPTS' };
    await expect(validateOtpRateLimit(user, db.models)).rejects.toMatchObject({
      statusCode: 429,
      message: expect.stringContaining('too many failed attempts')
    });
  });

  it('uses the "too many requests" message when locked for that reason', async () => {
    const user = { _id: 'u1', isLocked: true, lockedUntil: new Date(NOW + 60 * 1000), lockReason: 'TOO_MANY_REQUESTS' };
    await expect(validateOtpRateLimit(user, db.models)).rejects.toMatchObject({
      message: expect.stringContaining('too many OTP requests')
    });
  });

  it('clears the lock and resets counters in the DB when the lock has expired', async () => {
    const created = await db.models.User.create({ email: 'a@x.com', isLocked: true, lockedUntil: new Date(NOW - 1000), otpRequestCount: 3 });
    const user = { _id: created._id, isLocked: true, lockedUntil: new Date(NOW - 1000) };

    const result = await validateOtpRateLimit(user, db.models);
    expect(result).toBe(true);

    const stored = await db.models.User.findById(created._id).lean();
    expect(stored.isLocked).toBe(false);
    expect(stored.lockedUntil).toBeNull();
    expect(stored.otpRequestCount).toBe(0);
  });

  it('locks the user in the DB when they have made 5+ requests in the current window', async () => {
    const created = await db.models.User.create({ email: 'b@x.com', otpRequestCount: 5 });
    const user = { _id: created._id, otpRequestCount: 5, otpRequestWindowStart: new Date(NOW - 5 * 60 * 1000) };

    await expect(validateOtpRateLimit(user, db.models)).rejects.toMatchObject({
      statusCode: 429,
      message: 'Too many OTP requests. Account locked for 15 minutes.'
    });

    const stored = await db.models.User.findById(created._id).lean();
    expect(stored.isLocked).toBe(true);
    expect(stored.lockReason).toBe('TOO_MANY_REQUESTS');
  });

  it('treats the request count as 0 when the window has expired', async () => {
    const user = { _id: 'u1', otpRequestCount: 5, otpRequestWindowStart: new Date(NOW - 16 * 60 * 1000) };
    await expect(validateOtpRateLimit(user, db.models)).resolves.toBe(true);
  });

  it('throws 429 if an OTP was generated within the last 30 seconds', async () => {
    const user = { _id: 'u1', otpGeneratedAt: new Date(NOW - 10 * 1000) };
    await expect(validateOtpRateLimit(user, db.models)).rejects.toMatchObject({
      statusCode: 429,
      message: 'Please wait 30 seconds before requesting another OTP.'
    });
  });

  it('does not throw when the last OTP was generated more than 30 seconds ago', async () => {
    const user = { _id: 'u1', otpGeneratedAt: new Date(NOW - 31 * 1000) };
    await expect(validateOtpRateLimit(user, db.models)).resolves.toBe(true);
  });
});
