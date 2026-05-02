import { describe, it, expect } from 'vitest';
import getDateString from './getDateString.js';

describe('getDateString', () => {
  it('formats a date as "MMM D, YYYY"', () => {
    expect(getDateString('2024-01-05T10:30:00Z')).toBe('Jan 5, 2024');
    expect(getDateString('2024-12-15T00:00:00Z')).toBe('Dec 15, 2024');
  });
});
