import { describe, it, expect, beforeEach } from 'vitest';
import findSlideStage from '../helpers/findSlideStage';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedRun = (data) => {
  resetCache('run');
  createCache({
    key: 'run',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('findSlideStage', () => {
  beforeEach(() => {
    seedRun({
      stages: [
        { slideRef: 'slide-1', isComplete: true },
        { slideRef: 'slide-2', isComplete: false }
      ]
    });
  });

  it('returns the stage matching the slideRef', () => {
    expect(findSlideStage({ slideRef: 'slide-2' })).toEqual({
      slideRef: 'slide-2',
      isComplete: false
    });
  });

  it('returns undefined when no stage matches', () => {
    expect(findSlideStage({ slideRef: 'slide-x' })).toBeUndefined();
  });

  it('returns undefined when the run has no stages', () => {
    seedRun({});
    expect(findSlideStage({ slideRef: 'slide-1' })).toBeUndefined();
  });
});
