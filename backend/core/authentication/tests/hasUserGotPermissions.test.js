import { describe, it, expect } from 'vitest';
import hasUserGotPermissions from '../helpers/hasUserGotPermissions.js';

describe('hasUserGotPermissions', () => {
  it('returns true when the user role is in the permissions list', () => {
    expect(hasUserGotPermissions({ role: 'ADMIN' }, ['ADMIN', 'SUPER_ADMIN'])).toBe(true);
  });

  it('returns false when the user role is not in the permissions list', () => {
    expect(hasUserGotPermissions({ role: 'USER' }, ['ADMIN', 'SUPER_ADMIN'])).toBe(false);
  });

  it('returns false when the permissions list is empty', () => {
    expect(hasUserGotPermissions({ role: 'ADMIN' }, [])).toBe(false);
  });
});
