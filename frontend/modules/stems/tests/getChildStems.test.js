import { describe, it, expect, beforeEach } from 'vitest';
import getChildStems from '../helpers/getChildStems';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedStems = (stems) => {
  createCache({
    key: 'stems',
    cache: { getInitialData: () => stems },
    container: { props: {} }
  });
};

describe('getChildStems', () => {
  beforeEach(() => {
    resetCache('stems');
  });

  it('returns the stems in the branching options, in branching option order', () => {
    seedStems([{ ref: 'stem-1' }, { ref: 'stem-2' }, { ref: 'stem-3' }]);

    const stem = { ref: 'parent', branchingOptions: [{ stemRef: 'stem-3' }, { stemRef: 'stem-1' }] };

    expect(getChildStems({ stem })).toEqual([{ ref: 'stem-3' }, { ref: 'stem-1' }]);
  });

  it('skips branching options whose stem is not loaded', () => {
    seedStems([{ ref: 'stem-1' }]);

    const stem = { ref: 'parent', branchingOptions: [{ stemRef: 'missing' }, { stemRef: 'stem-1' }] };

    expect(getChildStems({ stem })).toEqual([{ ref: 'stem-1' }]);
  });

  it('returns an empty array when the stem has no branching options', () => {
    seedStems([{ ref: 'stem-1' }]);

    expect(getChildStems({ stem: { ref: 'parent', branchingOptions: [] } })).toEqual([]);
  });

  it('returns an empty array when no stem is given', () => {
    seedStems([{ ref: 'stem-1' }]);

    expect(getChildStems({ stem: undefined })).toEqual([]);
  });
});
