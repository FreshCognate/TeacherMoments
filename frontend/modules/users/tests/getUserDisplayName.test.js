import { describe, it, expect } from 'vitest';
import getUserDisplayName from '../helpers/getUserDisplayName';

describe('getUserDisplayName', () => {
  it('returns "Unknown user" when no user is provided', () => {
    expect(getUserDisplayName(undefined)).toBe('Unknown user');
    expect(getUserDisplayName(null)).toBe('Unknown user');
  });

  it('returns the full name when firstName and lastName are present', () => {
    expect(getUserDisplayName({ firstName: 'Alex', lastName: 'Doe' })).toBe('Alex Doe');
  });

  it('falls back to the username when only firstName is set', () => {
    expect(getUserDisplayName({ firstName: 'Alex', username: 'alex42' })).toBe('alex42');
  });

  it('falls back to the username when only lastName is set', () => {
    expect(getUserDisplayName({ lastName: 'Doe', username: 'doe-d' })).toBe('doe-d');
  });

  it('falls back to the username when neither name part is set', () => {
    expect(getUserDisplayName({ username: 'alex42' })).toBe('alex42');
  });
});
