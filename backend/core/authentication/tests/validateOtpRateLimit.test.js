import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import validateOtpRateLimit from '../services/validateOtpRateLimit.js';

const buildModels = () => ({
  User: { findByIdAndUpdate: vi.fn().mockResolvedValue({}) }
});

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

describe('validateOtpRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true when the user is not locked and has no prior OTP activity', async () => {
    const models = buildModels();
    const user = { _id: 'u1' };
    await expect(validateOtpRateLimit(user, models)).resolves.toBe(true);
    expect(models.User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('throws 429 when the user is locked and the lock has not expired', async () => {
    const models = buildModels();
    const user = {
      _id: 'u1',
      isLocked: true,
      lockedUntil: new Date(FIXED_NOW.getTime() + 5 * 60 * 1000),
      lockReason: 'TOO_MANY_ATTEMPTS'
    };

    await expect(validateOtpRateLimit(user, models)).rejects.toMatchObject({
      statusCode: 429,
      message: expect.stringContaining('too many failed attempts')
    });
  });

  it('uses the "too many requests" message when locked for that reason', async () => {
    const models = buildModels();
    const user = {
      _id: 'u1',
      isLocked: true,
      lockedUntil: new Date(FIXED_NOW.getTime() + 1 * 60 * 1000),
      lockReason: 'TOO_MANY_REQUESTS'
    };

    await expect(validateOtpRateLimit(user, models)).rejects.toMatchObject({
      message: expect.stringContaining('too many OTP requests')
    });
  });

  it('clears the lock and resets counters when the lock has expired', async () => {
    const models = buildModels();
    const user = {
      _id: 'u1',
      isLocked: true,
      lockedUntil: new Date(FIXED_NOW.getTime() - 1000)
    };

    const result = await validateOtpRateLimit(user, models);

    expect(result).toBe(true);
    expect(models.User.findByIdAndUpdate).toHaveBeenCalledWith('u1', {
      isLocked: false,
      lockedUntil: null,
      lockReason: null,
      otpAttempts: 0,
      otpRequestCount: 0
    });
    expect(user.isLocked).toBe(false);
    expect(user.otpRequestCount).toBe(0);
  });

  it('locks the user when they have made 5+ requests in the current window', async () => {
    const models = buildModels();
    const user = {
      _id: 'u1',
      otpRequestCount: 5,
      otpRequestWindowStart: new Date(FIXED_NOW.getTime() - 5 * 60 * 1000)
    };

    await expect(validateOtpRateLimit(user, models)).rejects.toMatchObject({
      statusCode: 429,
      message: 'Too many OTP requests. Account locked for 15 minutes.'
    });

    expect(models.User.findByIdAndUpdate).toHaveBeenCalledWith('u1', {
      isLocked: true,
      lockedUntil: new Date(FIXED_NOW.getTime() + 15 * 60 * 1000),
      lockReason: 'TOO_MANY_REQUESTS'
    });
  });

  it('treats the request count as 0 when the window has expired', async () => {
    const models = buildModels();
    const user = {
      _id: 'u1',
      otpRequestCount: 5,
      otpRequestWindowStart: new Date(FIXED_NOW.getTime() - 16 * 60 * 1000)
    };

    await expect(validateOtpRateLimit(user, models)).resolves.toBe(true);
  });

  it('throws 429 if an OTP was generated within the last 30 seconds', async () => {
    const models = buildModels();
    const user = {
      _id: 'u1',
      otpGeneratedAt: new Date(FIXED_NOW.getTime() - 10 * 1000)
    };

    await expect(validateOtpRateLimit(user, models)).rejects.toMatchObject({
      statusCode: 429,
      message: 'Please wait 30 seconds before requesting another OTP.'
    });
  });

  it('does not throw when the last OTP was generated more than 30 seconds ago', async () => {
    const models = buildModels();
    const user = {
      _id: 'u1',
      otpGeneratedAt: new Date(FIXED_NOW.getTime() - 31 * 1000)
    };

    await expect(validateOtpRateLimit(user, models)).resolves.toBe(true);
  });
});
