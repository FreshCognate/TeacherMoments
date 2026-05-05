import { describe, it, expect } from 'vitest';
import isValueEmpty from './isValueEmpty.js';

describe('isValueEmpty', () => {
  it('returns true only for an empty string', () => {
    expect(isValueEmpty('')).toBe(true);
  });

  it('returns false for any other value', () => {
    expect(isValueEmpty('hello')).toBe(false);
    expect(isValueEmpty(undefined)).toBe(false);
    expect(isValueEmpty(null)).toBe(false);
    expect(isValueEmpty(0)).toBe(false);
    expect(isValueEmpty([])).toBe(false);
  });
});
