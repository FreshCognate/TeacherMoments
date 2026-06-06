import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import verifyOtp from '../services/verifyOtp.js';

const db = setupMongo();

const NOW = Date.now();

const createUser = (overrides = {}) => db.models.User.create({
  email: 'sam@example.com',
  isVerified: true,
  firstLoggedInAt: new Date(NOW),
  otpCode: '123456',
  otpAttempts: 0,
  otpGeneratedAt: new Date(NOW - 60 * 1000),
  ...overrides
});

const req = (overrides = {}) => ({ logIn: vi.fn((u, cb) => cb()), ...overrides });

describe('verifyOtp (in-memory mongo)', () => {
  beforeEach(() => {});

  it('throws 404 when no user is found', async () => {
    await expect(
      verifyOtp({ email: 'nope@example.com', otpCode: '123456' }, { models: db.models, req: req() })
    ).rejects.toMatchObject({ statusCode: 404, message: 'User not found' });
  });

  it('throws 429 when the user is locked and lock has not expired', async () => {
    await createUser({ isLocked: true, lockedUntil: new Date(NOW + 5 * 60 * 1000) });
    await expect(
      verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, { models: db.models, req: req() })
    ).rejects.toMatchObject({ statusCode: 429 });
  });

  it('clears the lock when it has expired and proceeds', async () => {
    const user = await createUser({ isLocked: true, lockedUntil: new Date(NOW - 1000) });
    await verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, { models: db.models, req: req() });
    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.isLocked).toBe(false);
  });

  it('throws 400 when the user has no OTP code', async () => {
    await createUser({ otpCode: null });
    await expect(
      verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, { models: db.models, req: req() })
    ).rejects.toMatchObject({ statusCode: 400, message: 'No OTP found. Please request a new one.' });
  });

  it('throws 400 when the OTP has expired', async () => {
    await createUser({ otpGeneratedAt: new Date(NOW - 11 * 60 * 1000) });
    await expect(
      verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, { models: db.models, req: req() })
    ).rejects.toMatchObject({ statusCode: 400, message: 'OTP has expired. Please request a new one.' });
  });

  it('locks the user and clears the OTP after 5 attempts', async () => {
    const user = await createUser({ otpAttempts: 5 });
    await expect(
      verifyOtp({ email: 'sam@example.com', otpCode: '999999' }, { models: db.models, req: req() })
    ).rejects.toMatchObject({ statusCode: 429, message: expect.stringContaining('Too many failed attempts') });

    const stored = await db.models.User.findById(user._id).select('+otpCode').lean();
    expect(stored.isLocked).toBe(true);
    expect(stored.lockReason).toBe('TOO_MANY_ATTEMPTS');
    expect(stored.otpCode).toBeNull();
  });

  it('increments otpAttempts and reports remaining attempts on a wrong code', async () => {
    const user = await createUser({ otpAttempts: 1 });
    await expect(
      verifyOtp({ email: 'sam@example.com', otpCode: '999999' }, { models: db.models, req: req() })
    ).rejects.toMatchObject({ statusCode: 400, message: expect.stringContaining('3 attempt') });

    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.otpAttempts).toBe(2);
  });

  it('lowercases the email when finding the user and logs in on success', async () => {
    await createUser();
    const request = req();
    const result = await verifyOtp({ email: 'Sam@EXAMPLE.com', otpCode: '123456' }, { models: db.models, req: request });
    expect(request.logIn).toHaveBeenCalled();
    expect(result.otpCode).toBeUndefined();
  });

  it('marks the user as verified when they were not previously', async () => {
    const user = await createUser({ isVerified: false });
    await verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, { models: db.models, req: req() });
    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.isVerified).toBe(true);
    expect(stored.verifiedAt).toBeInstanceOf(Date);
  });

  it('sets firstLoggedInAt when the user has never logged in before', async () => {
    const user = await createUser({ firstLoggedInAt: null });
    await verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, { models: db.models, req: req() });
    const stored = await db.models.User.findById(user._id).lean();
    expect(stored.firstLoggedInAt).toBeInstanceOf(Date);
  });

  it('rejects with 500 when req.logIn fails', async () => {
    await createUser();
    const request = req({ logIn: vi.fn((u, cb) => cb(new Error('login failed'))) });
    await expect(
      verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, { models: db.models, req: request })
    ).rejects.toMatchObject({ statusCode: 500, message: 'Authentication successful but login failed' });
  });
});
