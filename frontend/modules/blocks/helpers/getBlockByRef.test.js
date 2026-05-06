import { describe, it, expect, beforeEach } from 'vitest';
import getBlockByRef from './getBlockByRef.js';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedBlocks = (blocks) => {
  resetCache('blocks');
  createCache({
    key: 'blocks',
    cache: { getInitialData: () => blocks },
    container: { props: {} }
  });
};

describe('getBlockByRef', () => {
  beforeEach(() => {
    seedBlocks([
      { _id: '1', ref: 'a', blockType: 'TEXT' },
      { _id: '2', ref: 'b', blockType: 'IMAGES' }
    ]);
  });

  it('returns the block whose ref matches', () => {
    expect(getBlockByRef({ ref: 'b' })).toMatchObject({ _id: '2', blockType: 'IMAGES' });
  });

  it('returns undefined when no block matches the ref', () => {
    expect(getBlockByRef({ ref: 'missing' })).toBeUndefined();
  });
});
