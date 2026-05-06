import { describe, it, expect, beforeEach } from 'vitest';
import getPromptBlocksBySlideRef from './getPromptBlocksBySlideRef.js';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedBlocks = (blocks) => {
  resetCache('blocks');
  createCache({
    key: 'blocks',
    cache: { getInitialData: () => blocks },
    container: { props: {} }
  });
};

describe('getPromptBlocksBySlideRef', () => {
  beforeEach(() => {
    seedBlocks([
      { _id: '1', ref: 'a', slideRef: 's1', blockType: 'TEXT' },
      { _id: '2', ref: 'b', slideRef: 's1', blockType: 'INPUT_PROMPT' },
      { _id: '3', ref: 'c', slideRef: 's1', blockType: 'MULTIPLE_CHOICE_PROMPT' },
      { _id: '4', ref: 'd', slideRef: 's2', blockType: 'INPUT_PROMPT' },
      { _id: '5', ref: 'e', slideRef: 's1', blockType: 'IMAGES' }
    ]);
  });

  it('returns only PROMPT-display blocks for the matching slide ref', () => {
    const blocks = getPromptBlocksBySlideRef({ slideRef: 's1' });
    expect(blocks.map((b) => b.ref)).toEqual(['b', 'c']);
  });

  it('returns an empty array when no prompts match the slide ref', () => {
    seedBlocks([{ _id: '1', ref: 'a', slideRef: 's1', blockType: 'TEXT' }]);
    expect(getPromptBlocksBySlideRef({ slideRef: 's1' })).toEqual([]);
  });
});
