import { describe, it, expect } from 'vitest';
import getAvailableImageSizes, { SIZES } from '../getAvailableImageSizes.js';

describe('getAvailableImageSizes', () => {
  it('generates every smaller size for a large original', () => {
    expect(getAvailableImageSizes(2000)).toEqual([640, 320, 160]);
  });

  it('keeps the rendition that exactly matches the original width', () => {
    expect(getAvailableImageSizes(320)).toEqual([320, 160]);
  });

  it('keeps a rendition equal to the smallest size', () => {
    expect(getAvailableImageSizes(160)).toEqual([160]);
  });

  it('generates nothing larger than the original', () => {
    expect(getAvailableImageSizes(500)).toEqual([320, 160]);
  });

  it('generates no renditions for an original smaller than every size', () => {
    expect(getAvailableImageSizes(120)).toEqual([]);
  });

  it('honours a custom sizes list', () => {
    expect(getAvailableImageSizes(320, [400, 320, 200])).toEqual([320, 200]);
  });
});
