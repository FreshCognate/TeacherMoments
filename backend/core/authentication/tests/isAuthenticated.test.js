import { describe, it, expect, vi } from 'vitest';
import isAuthenticated from '../middleware/isAuthenticated.js';

const buildResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('isAuthenticated middleware', () => {
  it('calls next when the request is authenticated', async () => {
    const next = vi.fn();
    const req = { isAuthenticated: () => true };
    await isAuthenticated(req, buildResponse(), next);
    expect(next).toHaveBeenCalled();
  });

  it('responds with 401 and an isLoginRequired flag when not authenticated', async () => {
    const next = vi.fn();
    const res = buildResponse();
    const req = { isAuthenticated: () => false };

    await isAuthenticated(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorised. Please login.',
      statusCode: 401,
      isLoginRequired: true
    });
  });
});
