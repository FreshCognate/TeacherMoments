import { describe, it, expect } from 'vitest';
import getAvailableImageSize from './getAvailableImageSize.js';

describe('getAvailableImageSize', () => {
  it('returns "original" for gif image assets regardless of requested size', () => {
    const asset = { fileType: 'image', extension: 'gif', sizes: [320, 640] };
    expect(getAvailableImageSize({ asset, size: 320 })).toBe('original');
  });

  it('returns "original" when no asset or no size is provided', () => {
    expect(getAvailableImageSize({})).toBe('original');
    expect(getAvailableImageSize({ asset: { sizes: [320] } })).toBe('original');
  });

  it('returns the smallest available size that is >= the requested size', () => {
    const asset = { fileType: 'image', extension: 'png', sizes: [320, 640, 1280] };
    expect(getAvailableImageSize({ asset, size: 500 })).toBe(640);
    expect(getAvailableImageSize({ asset, size: 320 })).toBe(320);
  });

  it('falls back to the smallest available size when the request exceeds all sizes', () => {
    const asset = { fileType: 'image', extension: 'png', sizes: [320, 640] };
    expect(getAvailableImageSize({ asset, size: 2000 })).toBe(320);
  });
});
