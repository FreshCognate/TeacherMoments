import { describe, it, expect } from 'vitest';
import isInputEmpty from './isInputEmpty.js';

describe('isInputEmpty', () => {
  it('returns true for the canonical empty Slate value', () => {
    expect(isInputEmpty([{ type: 'paragraph', children: [{ text: '' }] }])).toBe(true);
  });

  it('returns false when text content is present', () => {
    expect(isInputEmpty([{ type: 'paragraph', children: [{ text: 'hello' }] }])).toBe(false);
  });

  it('returns false when there are multiple blocks', () => {
    expect(isInputEmpty([
      { type: 'paragraph', children: [{ text: '' }] },
      { type: 'paragraph', children: [{ text: '' }] }
    ])).toBe(false);
  });
});
