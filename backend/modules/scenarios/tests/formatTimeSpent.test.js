import { describe, it, expect } from 'vitest';
import formatTimeSpent from '../helpers/formatTimeSpent.js';

describe('formatTimeSpent', () => {
  it('returns "0:00" for falsy values', () => {
    expect(formatTimeSpent(0)).toBe('0:00');
    expect(formatTimeSpent(null)).toBe('0:00');
    expect(formatTimeSpent(undefined)).toBe('0:00');
  });

  it('formats sub-minute durations with zero-padded seconds', () => {
    expect(formatTimeSpent(5000)).toBe('0:05');
    expect(formatTimeSpent(45000)).toBe('0:45');
  });

  it('formats minute-plus durations', () => {
    expect(formatTimeSpent(60000)).toBe('1:00');
    expect(formatTimeSpent(125000)).toBe('2:05');
    expect(formatTimeSpent(605000)).toBe('10:05');
  });

  it('truncates fractional seconds', () => {
    expect(formatTimeSpent(5999)).toBe('0:05');
  });
});
