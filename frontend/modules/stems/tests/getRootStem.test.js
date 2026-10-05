import { describe, it, expect, beforeEach } from 'vitest';
import getRootStem from '../helpers/getRootStem';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedStems = (stems) => {
  createCache({
    key: 'stems',
    cache: { getInitialData: () => stems },
    container: { props: {} }
  });
};

describe('getRootStem', () => {
  beforeEach(() => {
    resetCache('stems');
  });

  it('returns the root stem', () => {
    seedStems([
      { ref: 'stem-1', isRoot: false },
      { ref: 'stem-2', isRoot: true }
    ]);
    expect(getRootStem()).toEqual({ ref: 'stem-2', isRoot: true });
  });

  it('returns undefined when there is no root stem', () => {
    seedStems([{ ref: 'stem-1', isRoot: false }]);
    expect(getRootStem()).toBeUndefined();
  });
});
