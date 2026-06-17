import { describe, it, expect } from 'vitest';

import isSlideRefMissing from '../helpers/isSlideRefMissing';

const slides = [
  { ref: 'slide-1' },
  { ref: 'slide-2' }
];

describe('isSlideRefMissing', () => {
  it('returns false when there is no slide ref', () => {
    expect(isSlideRefMissing({ slideRef: null, slides })).toBe(false);
    expect(isSlideRefMissing({ slideRef: undefined, slides })).toBe(false);
  });

  it('returns false for the special CONSENT and SUMMARY refs', () => {
    expect(isSlideRefMissing({ slideRef: 'CONSENT', slides })).toBe(false);
    expect(isSlideRefMissing({ slideRef: 'SUMMARY', slides })).toBe(false);
  });

  it('returns false when the slides cache has not loaded yet', () => {
    expect(isSlideRefMissing({ slideRef: 'slide-1', slides: undefined })).toBe(false);
    expect(isSlideRefMissing({ slideRef: 'slide-1', slides: [] })).toBe(false);
  });

  it('returns false when the slide ref exists in the loaded slides', () => {
    expect(isSlideRefMissing({ slideRef: 'slide-1', slides })).toBe(false);
    expect(isSlideRefMissing({ slideRef: 'slide-2', slides })).toBe(false);
  });

  it('returns true when a real slide ref is no longer in the loaded slides', () => {
    expect(isSlideRefMissing({ slideRef: 'deleted-slide', slides })).toBe(true);
  });
});
