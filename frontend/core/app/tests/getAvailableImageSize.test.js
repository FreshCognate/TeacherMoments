import { describe, it, expect } from 'vitest';
import getAvailableImageSize from '../helpers/getAvailableImageSize.js';

describe('getAvailableImageSize', () => {
  it('returns "original" for gif image assets regardless of requested size', () => {
    const asset = { fileType: 'image', extension: 'gif', sizes: [640, 320] };
    expect(getAvailableImageSize({ asset, size: 320 })).toBe('original');
  });

  it('returns "original" when no asset or no size is provided', () => {
    expect(getAvailableImageSize({})).toBe('original');
    expect(getAvailableImageSize({ asset: { sizes: [320] } })).toBe('original');
  });

  it('returns the largest available size that is >= the requested size', () => {
    const asset = { fileType: 'image', extension: 'png', sizes: [1280, 640, 320] };
    expect(getAvailableImageSize({ asset, size: 500 })).toBe(1280);
    expect(getAvailableImageSize({ asset, size: 700 })).toBe(1280);
    expect(getAvailableImageSize({ asset, size: 200 })).toBe(1280);
  });

  it('falls back to the largest available size when the request exceeds all sizes and width is unknown', () => {
    const asset = { fileType: 'image', extension: 'png', sizes: [640, 320, 160] };
    expect(getAvailableImageSize({ asset, size: 2000 })).toBe(640);
  });

  it('uses the original when no rendition is large enough and the original is sharper than the largest rendition', () => {
    const asset = { fileType: 'image', extension: 'png', width: 500, sizes: [320, 160] };
    expect(getAvailableImageSize({ asset, size: 640 })).toBe('original');
  });

  it('uses the original for an original between the smallest sizes', () => {
    const asset = { fileType: 'image', extension: 'png', width: 200, sizes: [160] };
    expect(getAvailableImageSize({ asset, size: 640 })).toBe('original');
  });

  it('keeps the matching rendition when one is >= the requested size (multi-image case)', () => {
    const asset = { fileType: 'image', extension: 'png', width: 500, sizes: [320, 160] };
    expect(getAvailableImageSize({ asset, size: 320 })).toBe(320);
  });

  it('keeps the largest rendition when the original is no sharper than it', () => {
    const asset = { fileType: 'image', extension: 'png', width: 320, sizes: [320, 160] };
    expect(getAvailableImageSize({ asset, size: 640 })).toBe(320);
  });
});
