import { describe, it, expect, beforeEach } from 'vitest';

import createStageForSlide from '../helpers/createStageForSlide';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seed = (key, data) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('createStageForSlide', () => {
  beforeEach(() => {
    seed('blocks', []);
  });

  it('returns a stage with default tracking for each block on the slide', () => {
    seed('blocks', [
      { ref: 'b-1', slideRef: 'slide-1', blockType: 'TEXT' },
      { ref: 'b-2', slideRef: 'slide-1', blockType: 'MULTIPLE_CHOICE_PROMPT' },
      { ref: 'b-3', slideRef: 'slide-1', blockType: 'INPUT_PROMPT' },
      { ref: 'b-4', slideRef: 'other-slide', blockType: 'TEXT' }
    ]);

    const stage = createStageForSlide('slide-1');

    expect(stage.slideRef).toBe('slide-1');
    expect(stage.isComplete).toBe(false);
    expect(stage.startedAt).toBeInstanceOf(Date);
    expect(stage.blocksByRef).toEqual({
      'b-1': {},
      'b-2': { selectedOptions: [], isComplete: false },
      'b-3': { textValue: '', isComplete: false }
    });
  });
});
