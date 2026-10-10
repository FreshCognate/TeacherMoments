import { describe, it, expect } from 'vitest';
import canCurrentUserManageUser from '../helpers/canCurrentUserManageUser.js';

describe('canCurrentUserManageUser', () => {
  it('returns false when there is no user', () => {
    expect(canCurrentUserManageUser({ currentUser: { role: 'SUPER_ADMIN' }, user: null })).toBe(false);
  });

  it('returns false when an ADMIN targets a SUPER_ADMIN', () => {
    expect(canCurrentUserManageUser({ currentUser: { role: 'ADMIN' }, user: { role: 'SUPER_ADMIN' } })).toBe(false);
  });

  it('returns false when there is no current user and the target is a SUPER_ADMIN', () => {
    expect(canCurrentUserManageUser({ currentUser: undefined, user: { role: 'SUPER_ADMIN' } })).toBe(false);
  });

  it('returns true when a SUPER_ADMIN targets a SUPER_ADMIN', () => {
    expect(canCurrentUserManageUser({ currentUser: { role: 'SUPER_ADMIN' }, user: { role: 'SUPER_ADMIN' } })).toBe(true);
  });

  it('returns true when an ADMIN targets an ADMIN', () => {
    expect(canCurrentUserManageUser({ currentUser: { role: 'ADMIN' }, user: { role: 'ADMIN' } })).toBe(true);
  });

  it('returns true when an ADMIN targets a PARTICIPANT', () => {
    expect(canCurrentUserManageUser({ currentUser: { role: 'ADMIN' }, user: { role: 'PARTICIPANT' } })).toBe(true);
  });
});
