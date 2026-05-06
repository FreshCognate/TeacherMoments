import { describe, it, expect, beforeEach } from 'vitest';
import getBlocksBySlideRef from './getBlocksBySlideRef.js';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedBlocks = (blocks) => {
  resetCache('blocks');
  createCache({
    key: 'blocks',
    cache: { getInitialData: () => blocks },
    container: { props: {} }
  });
};

describe('getBlocksBySlideRef', () => {
  beforeEach(() => {
    seedBlocks([
      { _id: '1', ref: 'a', slideRef: 's1', blockType: 'TEXT' },
      { _id: '2', ref: 'b', slideRef: 's2', blockType: 'TEXT' },
      { _id: '3', ref: 'c', slideRef: 's1', blockType: 'IMAGES' }
    ]);
  });

  it('returns all blocks for the matching slide ref', () => {
    const blocks = getBlocksBySlideRef({ slideRef: 's1' });
    expect(blocks).toHaveLength(2);
    expect(blocks.map((b) => b.ref)).toEqual(['a', 'c']);
  });

  it('returns an empty array when no blocks match', () => {
    expect(getBlocksBySlideRef({ slideRef: 'missing' })).toEqual([]);
  });
});
