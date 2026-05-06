import { describe, it, expect, vi } from 'vitest';
import hasPermissions from '../middleware/hasPermissions.js';

describe('hasPermissions middleware', () => {
  it('calls next() when the user has one of the required permissions', () => {
    const middleware = hasPermissions(['ADMIN']);
    const req = { user: { role: 'ADMIN' } };
    const next = vi.fn();

    middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.status).toBe(200);
    expect(req.error).toBeNull();
  });

  it('skips to the next route ("route") when the user does not have permission', () => {
    const middleware = hasPermissions(['ADMIN']);
    const req = { user: { role: 'USER' } };
    const next = vi.fn();

    middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith('route');
    expect(req.status).toBe(401);
    expect(req.error).toBe("User doesn't have correct permissions");
  });
});
