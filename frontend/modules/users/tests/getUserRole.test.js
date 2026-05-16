import { describe, it, expect } from 'vitest';
import getUserRole from '../helpers/getUserRole';

describe('getUserRole', () => {
  it('returns "Unknown" when no user is provided', () => {
    expect(getUserRole(undefined)).toBe('Unknown');
    expect(getUserRole(null)).toBe('Unknown');
  });

  it('returns "Owner" for the OWNER role', () => {
    expect(getUserRole({ role: 'OWNER' })).toBe('Owner');
  });

  it('returns "Author" for the AUTHOR role', () => {
    expect(getUserRole({ role: 'AUTHOR' })).toBe('Author');
  });

  it('returns undefined for an unrecognised role', () => {
    expect(getUserRole({ role: 'GUEST' })).toBeUndefined();
  });
});
