import { describe, it, expect, beforeEach, vi } from 'vitest';

const { getActiveStemRefMock } = vi.hoisted(() => ({
  getActiveStemRefMock: vi.fn()
}));

vi.mock('../helpers/getActiveStemRef', () => ({
  default: () => getActiveStemRefMock()
}));

import getCurrentStemSlides from '../helpers/getCurrentStemSlides';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const slides = [
  { _id: 'slide-1', stemRef: 'stem-1' },
  { _id: 'slide-2', stemRef: 'stem-2' },
  { _id: 'slide-3', stemRef: 'stem-1' }
];

describe('getCurrentStemSlides', () => {
  beforeEach(() => {
    resetCache('slides');
    createCache({
      key: 'slides',
      cache: { getInitialData: () => slides },
      container: { props: {} }
    });
  });

  it('returns the slides in the active stem', () => {
    getActiveStemRefMock.mockReturnValue('stem-1');
    expect(getCurrentStemSlides()).toEqual([
      { _id: 'slide-1', stemRef: 'stem-1' },
      { _id: 'slide-3', stemRef: 'stem-1' }
    ]);
  });

  it('returns all slides when there is no active stem', () => {
    getActiveStemRefMock.mockReturnValue(null);
    expect(getCurrentStemSlides()).toEqual(slides);
  });
});
