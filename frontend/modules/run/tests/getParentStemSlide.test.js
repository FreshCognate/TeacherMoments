import { describe, it, expect, beforeEach } from 'vitest';
import getParentStemSlide from '../helpers/getParentStemSlide';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seed = (key, data) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const sharedStem = { ref: 'stem-shared' };

describe('getParentStemSlide', () => {
  beforeEach(() => {
    seed('stems', [
      { ref: 'stem-first', branchingOptions: [{ stemRef: 'stem-shared' }] },
      { ref: 'stem-second', branchingOptions: [{ stemRef: 'stem-shared' }] },
      sharedStem
    ]);
    seed('slides', [
      { ref: 'first-2', sortOrder: 1, stemRef: 'stem-first' },
      { ref: 'first-1', sortOrder: 0, stemRef: 'stem-first' },
      { ref: 'second-1', sortOrder: 0, stemRef: 'stem-second' },
      { ref: 'shared-1', sortOrder: 0, stemRef: 'stem-shared' }
    ]);
    seed('run', { stages: [] });
  });

  it('returns the last slide of the parent stem that appears latest in the run', () => {
    seed('run', { stages: [{ slideRef: 'first-2' }, { slideRef: 'second-1' }, { slideRef: 'shared-1' }] });

    expect(getParentStemSlide({ stem: sharedStem })).toEqual({ ref: 'second-1', sortOrder: 0, stemRef: 'stem-second' });
  });

  it('falls back to the last slide of the first parent stem when the run has not visited any', () => {
    expect(getParentStemSlide({ stem: sharedStem })).toEqual({ ref: 'first-2', sortOrder: 1, stemRef: 'stem-first' });
  });

  it('returns undefined when the stem has no parent stems', () => {
    expect(getParentStemSlide({ stem: { ref: 'stem-first' } })).toBeUndefined();
  });
});
