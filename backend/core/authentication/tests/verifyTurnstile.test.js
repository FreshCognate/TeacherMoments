import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import verifyTurnstile from '../services/verifyTurnstile.js';

const buildContext = (overrides = {}) => ({
  req: { ip: '1.2.3.4', connection: { remoteAddress: '1.2.3.4' } },
  ...overrides
});

describe('verifyTurnstile', () => {
  let originalEnabled;
  let originalSecret;
  let originalFetch;

  beforeEach(() => {
    originalEnabled = process.env.TURNSTILE_ENABLED;
    originalSecret = process.env.TURNSTILE_SECRET_KEY;
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    process.env.TURNSTILE_ENABLED = originalEnabled;
    process.env.TURNSTILE_SECRET_KEY = originalSecret;
    globalThis.fetch = originalFetch;
  });

  it('bypasses verification when TURNSTILE_ENABLED is "false"', async () => {
    process.env.TURNSTILE_ENABLED = 'false';
    const result = await verifyTurnstile('any-token', buildContext());
    expect(result).toEqual({ success: true, bypass: true });
  });

  it('throws 500 when the secret key is not configured', async () => {
    process.env.TURNSTILE_ENABLED = 'true';
    delete process.env.TURNSTILE_SECRET_KEY;

    await expect(verifyTurnstile('token', buildContext())).rejects.toMatchObject({
      statusCode: 500,
      message: 'Turnstile secret key not configured'
    });
  });

  it('throws 400 when no token is provided', async () => {
    process.env.TURNSTILE_ENABLED = 'true';
    process.env.TURNSTILE_SECRET_KEY = 'secret';

    await expect(verifyTurnstile(null, buildContext())).rejects.toMatchObject({
      statusCode: 400,
      message: 'Turnstile token is required'
    });
  });

  it('returns success metadata when Cloudflare confirms the token', async () => {
    process.env.TURNSTILE_ENABLED = 'true';
    process.env.TURNSTILE_SECRET_KEY = 'secret';

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true, hostname: 'mit-tm.com', challenge_ts: '2026-01-01T00:00:00Z' })
    });

    const result = await verifyTurnstile('valid-token', buildContext());
    expect(result).toMatchObject({ success: true, hostname: 'mit-tm.com', challengeTs: '2026-01-01T00:00:00Z' });
    expect(result.verifiedAt).toBeTruthy();
  });

  it('throws 403 when Cloudflare rejects the token', async () => {
    process.env.TURNSTILE_ENABLED = 'true';
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] })
    });

    await expect(verifyTurnstile('bad-token', buildContext())).rejects.toMatchObject({
      statusCode: 403,
      message: expect.stringContaining('Verification expired or invalid')
    });

    consoleErrorSpy.mockRestore();
  });

  it('throws 500 when the fetch call itself fails', async () => {
    process.env.TURNSTILE_ENABLED = 'true';
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network down'));

    await expect(verifyTurnstile('token', buildContext())).rejects.toMatchObject({
      statusCode: 500,
      message: expect.stringContaining('Unable to verify')
    });

    consoleErrorSpy.mockRestore();
  });

  it('sends the secret, token, and client IP to the Cloudflare endpoint', async () => {
    process.env.TURNSTILE_ENABLED = 'true';
    process.env.TURNSTILE_SECRET_KEY = 'super-secret';

    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ success: true })
    });
    globalThis.fetch = fetchMock;

    await verifyTurnstile('token-xyz', { req: { ip: '5.6.7.8' } });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          secret: 'super-secret',
          response: 'token-xyz',
          remoteip: '5.6.7.8'
        })
      })
    );
  });
});
