import { describe, it, expect } from 'vitest';
import formatTimeSpent from './formatTimeSpent';

describe('formatTimeSpent', () => {
  it('returns "0:00" for falsy input', () => {
    expect(formatTimeSpent(undefined)).toBe('0:00');
    expect(formatTimeSpent(0)).toBe('0:00');
  });

  it('formats a value under one minute as 0:SS', () => {
    expect(formatTimeSpent(30 * 1000)).toBe('0:30');
    expect(formatTimeSpent(5 * 1000)).toBe('0:05');
  });

  it('formats a value over one minute as M:SS', () => {
    expect(formatTimeSpent(90 * 1000)).toBe('1:30');
    expect(formatTimeSpent(125 * 1000)).toBe('2:05');
  });

  it('zero-pads the seconds component', () => {
    expect(formatTimeSpent(60 * 1000)).toBe('1:00');
    expect(formatTimeSpent(61 * 1000)).toBe('1:01');
  });

  it('floors fractional seconds', () => {
    expect(formatTimeSpent(1999)).toBe('0:01');
  });
});
