import { describe, it, expect, beforeEach } from 'vitest';
import getActiveSlideStems from '../helpers/getActiveSlideStems';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedStems = (stems) => {
  resetCache('stems');
  createCache({
    key: 'stems',
    cache: { getInitialData: () => stems },
    container: { props: {} }
  });
};

describe('getActiveSlideStems', () => {
  beforeEach(() => {
    seedStems([
      { _id: '1', ref: 'a', slideRef: 's1' },
      { _id: '2', ref: 'b', slideRef: 's1' },
      { _id: '3', ref: 'c', slideRef: 's2' },
      { _id: '4', ref: 'd' }
    ]);
  });

  it('returns only the stems for the active slide ref', () => {
    const stems = getActiveSlideStems({ activeSlideRef: 's1' });
    expect(stems).toHaveLength(2);
    expect(stems.map((stem) => stem.ref)).toEqual(['a', 'b']);
  });

  it('returns an empty array when the active slide has no stems', () => {
    expect(getActiveSlideStems({ activeSlideRef: 's3' })).toHaveLength(0);
  });

  it('returns an empty array when no activeSlideRef is passed, even if some stems have no slideRef', () => {
    expect(getActiveSlideStems({})).toEqual([]);
  });
});
