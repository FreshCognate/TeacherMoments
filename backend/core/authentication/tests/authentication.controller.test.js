import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { requestOtpMock, verifyOtpMock, verifyTurnstileMock } = vi.hoisted(() => ({
  requestOtpMock: vi.fn(),
  verifyOtpMock: vi.fn(),
  verifyTurnstileMock: vi.fn()
}));

vi.mock('../services/requestOtp.js', () => ({ default: (...args) => requestOtpMock(...args) }));
vi.mock('../services/verifyOtp.js', () => ({ default: (...args) => verifyOtpMock(...args) }));
vi.mock('../services/verifyTurnstile.js', () => ({ default: (...args) => verifyTurnstileMock(...args) }));

import controller from '../authentication.controller.js';

describe('authentication.controller', () => {
  let originalTurnstile;

  beforeEach(() => {
    originalTurnstile = process.env.TURNSTILE_ENABLED;
    vi.clearAllMocks();
    requestOtpMock.mockResolvedValue({ message: 'OTP sent', email: 'sam@example.com' });
    verifyOtpMock.mockResolvedValue({ _id: 'user-1' });
    verifyTurnstileMock.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    process.env.TURNSTILE_ENABLED = originalTurnstile;
  });

  describe('create', () => {
    it('verifies the turnstile token before requesting an OTP when turnstile is enabled', async () => {
      process.env.TURNSTILE_ENABLED = 'true';
      const context = {};

      await controller.create({ body: { email: 'sam@example.com', turnstileToken: 'tok' } }, context);

      expect(verifyTurnstileMock).toHaveBeenCalledWith('tok', context);
      expect(requestOtpMock).toHaveBeenCalledWith({ email: 'sam@example.com' }, context);
    });

    it('skips turnstile verification when TURNSTILE_ENABLED is "false"', async () => {
      process.env.TURNSTILE_ENABLED = 'false';

      await controller.create({ body: { email: 'sam@example.com' } }, {});

      expect(verifyTurnstileMock).not.toHaveBeenCalled();
      expect(requestOtpMock).toHaveBeenCalled();
    });

    it('returns the requestOtp result', async () => {
      process.env.TURNSTILE_ENABLED = 'false';
      const result = await controller.create({ body: { email: 'sam@example.com' } }, {});
      expect(result).toEqual({ message: 'OTP sent', email: 'sam@example.com' });
    });
  });

  describe('update', () => {
    it('verifies the OTP and wraps the result under "authentication"', async () => {
      verifyOtpMock.mockResolvedValue({ _id: 'user-1', email: 'sam@example.com' });
      const result = await controller.update({ body: { email: 'sam@example.com', otpCode: '123456' } }, { ctx: 'value' });

      expect(verifyOtpMock).toHaveBeenCalledWith({ email: 'sam@example.com', otpCode: '123456' }, { ctx: 'value' });
      expect(result).toEqual({ authentication: { _id: 'user-1', email: 'sam@example.com' } });
    });
  });

  describe('read', () => {
    it('returns the user from the context wrapped under "authentication"', async () => {
      const result = await controller.read({}, { user: { _id: 'user-1', email: 'sam@example.com' } });
      expect(result).toEqual({ authentication: { _id: 'user-1', email: 'sam@example.com' } });
    });
  });

  describe('delete', () => {
    it('logs the user out and responds with an empty object', async () => {
      const req = { logout: vi.fn((cb) => cb()) };
      const res = { json: vi.fn() };

      await controller.delete({}, { req, res });

      expect(req.logout).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({});
    });
  });
});
