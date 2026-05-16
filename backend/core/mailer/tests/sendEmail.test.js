import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { axiosPostMock } = vi.hoisted(() => ({
  axiosPostMock: vi.fn()
}));

vi.mock('axios', () => ({
  default: { post: (...args) => axiosPostMock(...args) }
}));

import sendEmail from '../helpers/sendEmail.js';

describe('sendEmail', () => {
  let originalApiKey;
  let originalFromEmail;
  let consoleErrorSpy;

  beforeEach(() => {
    originalApiKey = process.env.POSTMARK_API_KEY;
    originalFromEmail = process.env.POSTMARK_FROM_EMAIL;
    process.env.POSTMARK_API_KEY = 'test-api-key';
    process.env.POSTMARK_FROM_EMAIL = 'noreply@example.com';
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.POSTMARK_API_KEY = originalApiKey;
    process.env.POSTMARK_FROM_EMAIL = originalFromEmail;
    consoleErrorSpy.mockRestore();
  });

  it('throws when POSTMARK_API_KEY is not set', async () => {
    delete process.env.POSTMARK_API_KEY;
    await expect(sendEmail({ to: 'a@b.com', templateAlias: 'login' }))
      .rejects.toThrow('POSTMARK_API_KEY environment variable is not set');
  });

  it('throws when no "from" address is available', async () => {
    delete process.env.POSTMARK_FROM_EMAIL;
    await expect(sendEmail({ to: 'a@b.com', templateAlias: 'login' }))
      .rejects.toThrow('POSTMARK_FROM_EMAIL environment variable is not set');
  });

  it('uses the explicit "from" parameter even when POSTMARK_FROM_EMAIL is unset', async () => {
    delete process.env.POSTMARK_FROM_EMAIL;
    axiosPostMock.mockResolvedValue({ data: { MessageID: 'm1', To: 'a@b.com' } });

    await sendEmail({ to: 'a@b.com', templateAlias: 'login', from: 'override@example.com' });

    expect(axiosPostMock.mock.calls[0][1]).toMatchObject({ From: 'override@example.com' });
  });

  it('throws when no templateAlias is provided', async () => {
    await expect(sendEmail({ to: 'a@b.com' })).rejects.toThrow('templateAlias is required');
  });

  it('posts to the Postmark withTemplate endpoint with the correct payload and headers', async () => {
    axiosPostMock.mockResolvedValue({ data: { MessageID: 'msg-1', To: 'a@b.com' } });

    await sendEmail({
      to: 'a@b.com',
      templateAlias: 'login',
      templateModel: { name: 'Sam', otpCode: '123456' }
    });

    expect(axiosPostMock).toHaveBeenCalledWith(
      'https://api.postmarkapp.com/email/withTemplate',
      {
        From: 'noreply@example.com',
        To: 'a@b.com',
        TemplateAlias: 'login',
        TemplateModel: { name: 'Sam', otpCode: '123456' },
        MessageStream: 'outbound'
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': 'test-api-key'
        }
      }
    );
  });

  it('defaults templateModel to an empty object when not provided', async () => {
    axiosPostMock.mockResolvedValue({ data: { MessageID: 'msg-1', To: 'a@b.com' } });

    await sendEmail({ to: 'a@b.com', templateAlias: 'login' });

    expect(axiosPostMock.mock.calls[0][1].TemplateModel).toEqual({});
  });

  it('returns a success payload with the Postmark message id and recipient', async () => {
    axiosPostMock.mockResolvedValue({ data: { MessageID: 'msg-1', To: 'a@b.com' } });

    const result = await sendEmail({ to: 'a@b.com', templateAlias: 'login' });
    expect(result).toEqual({ success: true, messageId: 'msg-1', to: 'a@b.com' });
  });

  it('wraps Postmark response errors into a 500 with details', async () => {
    axiosPostMock.mockRejectedValue({
      response: { data: { Message: 'Invalid template alias' } }
    });

    await expect(sendEmail({ to: 'a@b.com', templateAlias: 'login' }))
      .rejects.toMatchObject({
        statusCode: 500,
        message: 'Failed to send email',
        details: { Message: 'Invalid template alias' }
      });
  });

  it('falls back to error.message when there is no response payload', async () => {
    axiosPostMock.mockRejectedValue(new Error('network unreachable'));

    await expect(sendEmail({ to: 'a@b.com', templateAlias: 'login' }))
      .rejects.toMatchObject({
        statusCode: 500,
        details: 'network unreachable'
      });
  });
});
