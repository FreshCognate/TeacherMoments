import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('~/modules/slides/helpers/getSlideErrors', () => ({
  default: vi.fn()
}));

import getScenarioErrors from '../helpers/getScenarioErrors';
import getSlideErrors from '~/modules/slides/helpers/getSlideErrors';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedSlides = (data) => {
  resetCache('slides');
  createCache({
    key: 'slides',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getScenarioErrors', () => {
  beforeEach(() => {
    getSlideErrors.mockReset().mockReturnValue([]);
  });

  it('returns an empty array when there are no slides', () => {
    seedSlides([]);
    expect(getScenarioErrors()).toEqual([]);
  });

  it('aggregates errors from each slide', () => {
    seedSlides([
      { _id: 's-1', ref: 'ref-1' },
      { _id: 's-2', ref: 'ref-2' }
    ]);
    getSlideErrors
      .mockReturnValueOnce([{ message: 'slide 1 issue' }])
      .mockReturnValueOnce([{ message: 'slide 2 issue' }]);

    expect(getScenarioErrors()).toEqual([
      { message: 'slide 1 issue' },
      { message: 'slide 2 issue' }
    ]);
  });

});
