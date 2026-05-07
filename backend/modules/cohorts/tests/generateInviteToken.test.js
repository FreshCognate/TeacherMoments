import { describe, it, expect } from 'vitest';
import generateInviteToken from '../helpers/generateInviteToken.js';

describe('generateInviteToken', () => {
  it('returns a 32-character hex string', () => {
    const token = generateInviteToken();
    expect(token).toMatch(/^[a-f0-9]{32}$/);
  });

  it('returns a different value on each call', () => {
    expect(generateInviteToken()).not.toBe(generateInviteToken());
  });
});
