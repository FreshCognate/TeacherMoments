import { describe, it, expect, vi, beforeEach } from 'vitest';

const { signupParticipantUserMock, verifyOtpMock } = vi.hoisted(() => ({
  signupParticipantUserMock: vi.fn(),
  verifyOtpMock: vi.fn()
}));

vi.mock('#core/users/services/signupParticipantUser.js', () => ({ default: (...args) => signupParticipantUserMock(...args) }));
vi.mock('../services/verifyOtp.js', () => ({ default: (...args) => verifyOtpMock(...args) }));

import controller from '../signup.controller.js';

describe('signup.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('passes username and email to signupParticipantUser', async () => {
      signupParticipantUserMock.mockResolvedValue({ _id: 'user-1' });
      const context = { ctx: 'value' };

      const result = await controller.create({ body: { username: 'sam', email: 'sam@example.com' } }, context);

      expect(signupParticipantUserMock).toHaveBeenCalledWith({ username: 'sam', email: 'sam@example.com' }, {}, context);
      expect(result).toEqual({ _id: 'user-1' });
    });
  });

  describe('update', () => {
    it('verifies the OTP and returns the user wrapped under "user"', async () => {
      verifyOtpMock.mockResolvedValue({ _id: 'user-1', email: 'sam@example.com' });

      const result = await controller.update({ body: { email: 'sam@example.com', otpCode: '123456' } }, { ctx: 'value' });

      expect(verifyOtpMock).toHaveBeenCalledWith({ email: 'sam@example.com', otpCode: '123456' }, { ctx: 'value' });
      expect(result).toEqual({ user: { _id: 'user-1', email: 'sam@example.com' } });
    });
  });
});
