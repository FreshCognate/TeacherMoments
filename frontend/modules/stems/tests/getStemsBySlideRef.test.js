import { describe, it, expect, beforeEach } from 'vitest';
import getStemsBySlideRef from '../helpers/getStemsBySlideRef.ts';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager.js';

const buildContainer = (props = {}) => ({ props });

const seedStems = (stems) => {
  createCache({
    key: 'stems',
    cache: { getInitialData: () => stems },
    container: buildContainer()
  });
};

describe('getStemsBySlideRef', () => {
  beforeEach(() => {
    resetCache('stems');
  });

  it('returns only the stems matching the given slideRef', () => {
    seedStems([
      { ref: 'stem-1', slideRef: 'slide-a' },
      { ref: 'stem-2', slideRef: 'slide-b' },
      { ref: 'stem-3', slideRef: 'slide-a' }
    ]);

    const result = getStemsBySlideRef({ slideRef: 'slide-a' });

    expect(result).toEqual([
      { ref: 'stem-1', slideRef: 'slide-a' },
      { ref: 'stem-3', slideRef: 'slide-a' }
    ]);
  });

  it('returns an empty array when no stems match the slideRef', () => {
    seedStems([
      { ref: 'stem-1', slideRef: 'slide-a' },
      { ref: 'stem-2', slideRef: 'slide-b' }
    ]);

    expect(getStemsBySlideRef({ slideRef: 'slide-z' })).toEqual([]);
  });

  it('returns an empty array when there are no stems cached', () => {
    seedStems([]);

    expect(getStemsBySlideRef({ slideRef: 'slide-a' })).toEqual([]);
  });

  it('returns an empty array when the stems cache does not exist', () => {
    expect(getStemsBySlideRef({ slideRef: 'slide-a' })).toEqual([]);
  });
});
