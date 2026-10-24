import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('~/modules/slides/helpers/getSlideErrors', () => ({
  default: vi.fn()
}));

vi.mock('~/modules/stems/helpers/getStemErrors', () => ({
  default: vi.fn()
}));

import getScenarioErrors from '../helpers/getScenarioErrors';
import getSlideErrors from '~/modules/slides/helpers/getSlideErrors';
import getStemErrors from '~/modules/stems/helpers/getStemErrors';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedCache = (key, data) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const seedSlides = (data) => seedCache('slides', data);

const seedStems = (data) => seedCache('stems', data);

describe('getScenarioErrors', () => {
  beforeEach(() => {
    getSlideErrors.mockReset().mockReturnValue([]);
    getStemErrors.mockReset().mockReturnValue([]);
    seedStems([]);
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

  it('checks each stem', () => {
    const stems = [
      { _id: 'st-1', ref: 'stem-1' },
      { _id: 'st-2', ref: 'stem-2' }
    ];
    seedStems(stems);
    seedSlides([]);

    getScenarioErrors();

    expect(getStemErrors).toHaveBeenCalledTimes(2);
    expect(getStemErrors).toHaveBeenCalledWith(stems[0]);
    expect(getStemErrors).toHaveBeenCalledWith(stems[1]);
  });

  it('lists stem errors before slide errors', () => {
    seedStems([{ _id: 'st-1', ref: 'stem-1' }]);
    seedSlides([{ _id: 's-1', ref: 'ref-1' }]);
    getStemErrors.mockReturnValue([{ message: 'stem issue' }]);
    getSlideErrors.mockReturnValue([{ message: 'slide issue' }]);

    expect(getScenarioErrors()).toEqual([
      { message: 'stem issue' },
      { message: 'slide issue' }
    ]);
  });
});
