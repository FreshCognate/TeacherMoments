import { describe, it, expect } from 'vitest';
import getUserDisplayName from '../helpers/getUserDisplayName.js';

describe('getUserDisplayName', () => {
  it('returns "Unknown user" when no user is provided', () => {
    expect(getUserDisplayName(null)).toBe('Unknown user');
    expect(getUserDisplayName(undefined)).toBe('Unknown user');
  });

  it('returns "FirstName LastName" when both names are set', () => {
    expect(getUserDisplayName({ firstName: 'Sam', lastName: 'Smith' })).toBe('Sam Smith');
  });

  it('falls back to the username when first name is missing', () => {
    expect(getUserDisplayName({ lastName: 'Smith', username: 'sammy' })).toBe('sammy');
  });

  it('falls back to the username when last name is missing', () => {
    expect(getUserDisplayName({ firstName: 'Sam', username: 'sammy' })).toBe('sammy');
  });
});
