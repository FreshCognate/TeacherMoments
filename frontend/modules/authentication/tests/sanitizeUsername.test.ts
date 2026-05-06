import { describe, it, expect } from 'vitest';
import sanitizeUsername from '../helpers/sanitizeUsername';

describe('sanitizeUsername', () => {
  it('lowercases the input', () => {
    expect(sanitizeUsername('AlexDoe')).toBe('alexdoe');
  });

  it('replaces whitespace with hyphens', () => {
    expect(sanitizeUsername('Alex Doe')).toBe('alex-doe');
    expect(sanitizeUsername('Alex   Doe')).toBe('alex-doe');
  });

  it('strips characters that are not lowercase letters or hyphens', () => {
    expect(sanitizeUsername('alex.doe@example.com')).toBe('alexdoeexamplecom');
    expect(sanitizeUsername('user_42')).toBe('user');
  });

  it('combines all rules together', () => {
    expect(sanitizeUsername('Alex Doe 42!')).toBe('alex-doe-');
  });
});
