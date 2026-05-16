import { describe, it, expect } from 'vitest';
import getTotalPages from '../helpers/getTotalPages.js';

describe('getTotalPages', () => {
  it('returns 1 when the count is 0', () => {
    expect(getTotalPages(0)).toBe(1);
  });

  it('rounds up to the next page when the count is not divisible by the page size', () => {
    expect(getTotalPages(21)).toBe(2);
    expect(getTotalPages(45)).toBe(3);
  });

  it('returns an exact division when the count fits evenly', () => {
    expect(getTotalPages(40)).toBe(2);
    expect(getTotalPages(20)).toBe(1);
  });

  it('respects a custom pagination amount', () => {
    expect(getTotalPages(45, 10)).toBe(5);
    expect(getTotalPages(100, 25)).toBe(4);
  });
});
