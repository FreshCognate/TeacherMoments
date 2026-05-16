import { describe, it, expect } from 'vitest';
import getUserEmail from '../helpers/getUserEmail';

describe('getUserEmail', () => {
  it('returns "Unknown email" when no user is provided', () => {
    expect(getUserEmail(undefined)).toBe('Unknown email');
    expect(getUserEmail(null)).toBe('Unknown email');
  });

  it('returns the email from the user', () => {
    expect(getUserEmail({ email: 'alex@example.com' })).toBe('alex@example.com');
  });

  it('returns undefined when the user has no email property', () => {
    expect(getUserEmail({ firstName: 'Alex' })).toBeUndefined();
  });
});
