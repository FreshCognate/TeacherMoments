import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import verifyOtp from '../services/verifyOtp.js';

const FIXED_NOW = new Date('2026-05-06T12:00:00Z');

const buildUserDocument = (overrides = {}) => {
  const user = {
    _id: 'user-1',
    email: 'sam@example.com',
    isLocked: false,
    lockedUntil: null,
    isVerified: true,
    firstLoggedInAt: FIXED_NOW,
    otpCode: '123456',
    otpAttempts: 0,
    otpGeneratedAt: new Date(FIXED_NOW.getTime() - 1 * 60 * 1000),
    toObject() {
      return { ...this };
    },
    ...overrides
  };
  return user;
};

const buildModels = (user) => ({
  User: {
    findOne: vi.fn(() => ({
      select: vi.fn().mockResolvedValue(user)
    })),
    findByIdAndUpdate: vi.fn().mockImplementation((id, update) => ({ _id: id, ...update, toObject() { return { ...this }; } }))
  }
});

const buildContext = (user, reqOverrides = {}) => ({
  models: buildModels(user),
  req: {
    logIn: vi.fn((u, cb) => cb()),
    ...reqOverrides
  }
});

describe('verifyOtp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 404 when no user is found', async () => {
    const context = {
      models: { User: { findOne: vi.fn(() => ({ select: vi.fn().mockResolvedValue(null) })) } },
      req: {}
    };

    await expect(verifyOtp({ email: 'nope@example.com', otpCode: '123456' }, context))
      .rejects.toMatchObject({ statusCode: 404, message: 'User not found' });
  });

  it('throws 429 when the user is locked and lock has not expired', async () => {
    const user = buildUserDocument({
      isLocked: true,
      lockedUntil: new Date(FIXED_NOW.getTime() + 5 * 60 * 1000)
    });
    const context = buildContext(user);

    await expect(verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, context))
      .rejects.toMatchObject({ statusCode: 429 });
  });

  it('clears the lock when it has expired and proceeds', async () => {
    const user = buildUserDocument({
      isLocked: true,
      lockedUntil: new Date(FIXED_NOW.getTime() - 1000),
      otpCode: '123456'
    });
    const context = buildContext(user);

    await verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', {
      isLocked: false,
      lockedUntil: null,
      lockReason: null,
      otpAttempts: 0
    });
  });

  it('throws 400 when the user has no OTP code', async () => {
    const user = buildUserDocument({ otpCode: null });
    const context = buildContext(user);

    await expect(verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, context))
      .rejects.toMatchObject({ statusCode: 400, message: 'No OTP found. Please request a new one.' });
  });

  it('throws 400 when the OTP has expired', async () => {
    const user = buildUserDocument({
      otpGeneratedAt: new Date(FIXED_NOW.getTime() - 11 * 60 * 1000)
    });
    const context = buildContext(user);

    await expect(verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, context))
      .rejects.toMatchObject({ statusCode: 400, message: 'OTP has expired. Please request a new one.' });
  });

  it('locks the user and clears the OTP after 5 attempts', async () => {
    const user = buildUserDocument({ otpAttempts: 5 });
    const context = buildContext(user);

    await expect(verifyOtp({ email: 'sam@example.com', otpCode: '999999' }, context))
      .rejects.toMatchObject({ statusCode: 429, message: expect.stringContaining('Too many failed attempts') });

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      isLocked: true,
      lockReason: 'TOO_MANY_ATTEMPTS',
      otpCode: null
    }));
  });

  it('increments otpAttempts and reports remaining attempts on a wrong code', async () => {
    const user = buildUserDocument({ otpAttempts: 1 });
    const context = buildContext(user);

    await expect(verifyOtp({ email: 'sam@example.com', otpCode: '999999' }, context))
      .rejects.toMatchObject({ statusCode: 400, message: expect.stringContaining('3 attempt') });

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', { $inc: { otpAttempts: 1 } });
  });

  it('lowercases the email when finding the user', async () => {
    const user = buildUserDocument();
    const context = buildContext(user);

    await verifyOtp({ email: 'Sam@EXAMPLE.com', otpCode: '123456' }, context);

    expect(context.models.User.findOne).toHaveBeenCalledWith({
      email: 'sam@example.com',
      isDeleted: false
    });
  });

  it('logs the user in and returns the user without the otpCode field on success', async () => {
    const user = buildUserDocument();
    const context = buildContext(user);

    const result = await verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, context);

    expect(context.req.logIn).toHaveBeenCalled();
    expect(result.otpCode).toBeUndefined();
  });

  it('marks the user as verified when they were not previously', async () => {
    const user = buildUserDocument({ isVerified: false });
    const context = buildContext(user);

    await verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      isVerified: true,
      verifiedAt: expect.any(Date)
    }), expect.any(Object));
  });

  it('sets firstLoggedInAt when the user has never logged in before', async () => {
    const user = buildUserDocument({ firstLoggedInAt: null });
    const context = buildContext(user);

    await verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, context);

    expect(context.models.User.findByIdAndUpdate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      firstLoggedInAt: expect.any(Date)
    }), expect.any(Object));
  });

  it('rejects with 500 when req.logIn fails', async () => {
    const user = buildUserDocument();
    const context = buildContext(user, {
      logIn: vi.fn((u, cb) => cb(new Error('login failed')))
    });

    await expect(verifyOtp({ email: 'sam@example.com', otpCode: '123456' }, context))
      .rejects.toMatchObject({ statusCode: 500, message: 'Authentication successful but login failed' });
  });
});
