import { describe, it, expect } from 'vitest';
import buildSlateFromText from '../helpers/buildSlateFromText.js';

describe('buildSlateFromText', () => {
  it('wraps text in a single paragraph', () => {
    expect(buildSlateFromText('Hello')).toEqual([
      { type: 'paragraph', children: [{ text: 'Hello' }] }
    ]);
  });

  it('returns an empty paragraph for empty/falsy input', () => {
    const empty = [{ type: 'paragraph', children: [{ text: '' }] }];

    expect(buildSlateFromText('')).toEqual(empty);
    expect(buildSlateFromText(null)).toEqual(empty);
    expect(buildSlateFromText(undefined)).toEqual(empty);
  });
});
