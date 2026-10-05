import { describe, it, expect, beforeEach } from 'vitest';
import getStemsByStemRef from '../helpers/getStemsByStemRef';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedStems = (stems) => {
  createCache({
    key: 'stems',
    cache: { getInitialData: () => stems },
    container: { props: {} }
  });
};

describe('getStemsByStemRef', () => {
  beforeEach(() => {
    resetCache('stems');
  });

  it('returns only the child stems of the given parent stem', () => {
    seedStems([
      { ref: 'stem-1', stemRef: 'parent-a' },
      { ref: 'stem-2', stemRef: 'parent-b' },
      { ref: 'stem-3', stemRef: 'parent-a' }
    ]);
    expect(getStemsByStemRef({ stemRef: 'parent-a' })).toEqual([
      { ref: 'stem-1', stemRef: 'parent-a' },
      { ref: 'stem-3', stemRef: 'parent-a' }
    ]);
  });

  it('returns an empty array when the stem has no children', () => {
    seedStems([{ ref: 'stem-1', stemRef: 'parent-a' }]);
    expect(getStemsByStemRef({ stemRef: 'parent-z' })).toEqual([]);
  });
});
