import { describe, it, expect, vi } from 'vitest';

const { getCurrentStemSlidesMock } = vi.hoisted(() => ({
  getCurrentStemSlidesMock: vi.fn()
}));

vi.mock('~/modules/stems/helpers/getCurrentStemSlides', () => ({
  default: () => getCurrentStemSlidesMock()
}));

import getLastStemSlide from '../helpers/getLastStemSlide';

describe('getLastStemSlide', () => {
  it('returns the last slide in the current stem', () => {
    getCurrentStemSlidesMock.mockReturnValue([
      { _id: 'slide-1', ref: 'ref-1' },
      { _id: 'slide-2', ref: 'ref-2' }
    ]);
    expect(getLastStemSlide()).toEqual({ _id: 'slide-2', ref: 'ref-2' });
  });

  it('returns undefined when the current stem has no slides', () => {
    getCurrentStemSlidesMock.mockReturnValue([]);
    expect(getLastStemSlide()).toBeUndefined();
  });
});
