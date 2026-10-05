import { describe, it, expect, beforeEach } from 'vitest';
import getParentStemSlideId from '../helpers/getParentStemSlideId';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seed = (key, data) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getParentStemSlideId', () => {
  beforeEach(() => {
    seed('stems', [
      { ref: 'root-stem', isRoot: true },
      { ref: 'child-stem', stemRef: 'root-stem' }
    ]);
    seed('slides', [
      { _id: 'root-slide-1', stemRef: 'root-stem' },
      { _id: 'root-slide-2', stemRef: 'root-stem' },
      { _id: 'child-slide-1', stemRef: 'child-stem' }
    ]);
  });

  it('returns the last slide of the parent stem', () => {
    seed('editor', { activeStemRef: 'child-stem' });
    expect(getParentStemSlideId()).toBe('root-slide-2');
  });

  it('returns undefined when the active stem has no parent', () => {
    seed('editor', { activeStemRef: 'root-stem' });
    expect(getParentStemSlideId()).toBeUndefined();
  });

  it('returns undefined when there is no active stem', () => {
    seed('editor', { activeStemRef: null });
    expect(getParentStemSlideId()).toBeUndefined();
  });
});
