import { describe, it, expect } from 'vitest';
import getDoesSlideContainPrompts from '../helpers/getDoesSlideContainPrompts';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedBlocks = (blocks) => {
  resetCache('blocks');
  createCache({
    key: 'blocks',
    cache: { getInitialData: () => blocks },
    container: { props: {} }
  });
};

describe('getDoesSlideContainPrompts', () => {
  it('returns true when the slide has a prompt block', () => {
    seedBlocks([
      { _id: '1', ref: 'a', slideRef: 's1', blockType: 'TEXT' },
      { _id: '2', ref: 'b', slideRef: 's1', blockType: 'INPUT_PROMPT' }
    ]);
    expect(getDoesSlideContainPrompts({ slide: { ref: 's1' } })).toBe(true);
  });

  it('returns false when the slide only has non-prompt blocks', () => {
    seedBlocks([
      { _id: '1', ref: 'a', slideRef: 's1', blockType: 'TEXT' },
      { _id: '2', ref: 'b', slideRef: 's1', blockType: 'IMAGES' }
    ]);
    expect(getDoesSlideContainPrompts({ slide: { ref: 's1' } })).toBe(false);
  });

  it('returns false when prompt blocks belong to a different slide', () => {
    seedBlocks([
      { _id: '1', ref: 'a', slideRef: 's2', blockType: 'INPUT_PROMPT' }
    ]);
    expect(getDoesSlideContainPrompts({ slide: { ref: 's1' } })).toBe(false);
  });
});
