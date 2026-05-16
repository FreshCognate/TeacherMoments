import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('~/modules/slides/helpers/getSlideErrors', () => ({
  default: vi.fn()
}));
vi.mock('~/modules/triggers/helpers/getTriggerErrors', () => ({
  default: vi.fn()
}));
vi.mock('~/modules/triggers/helpers/getTriggersBySlideRef', () => ({
  default: vi.fn()
}));

import getScenarioErrors from '../helpers/getScenarioErrors';
import getSlideErrors from '~/modules/slides/helpers/getSlideErrors';
import getTriggerErrors from '~/modules/triggers/helpers/getTriggerErrors';
import getTriggersBySlideRef from '~/modules/triggers/helpers/getTriggersBySlideRef';
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
    getTriggerErrors.mockReset().mockReturnValue([]);
    getTriggersBySlideRef.mockReset().mockReturnValue([]);
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

  it('aggregates errors from triggers attached to each slide', () => {
    seedSlides([{ _id: 's-1', ref: 'ref-1' }]);
    getTriggersBySlideRef.mockReturnValue([
      { _id: 't-1' },
      { _id: 't-2' }
    ]);
    getTriggerErrors
      .mockReturnValueOnce([{ message: 'trig 1 issue' }])
      .mockReturnValueOnce([{ message: 'trig 2 issue' }]);

    expect(getScenarioErrors()).toEqual([
      { message: 'trig 1 issue' },
      { message: 'trig 2 issue' }
    ]);
  });

  it('queries triggers by the slide ref', () => {
    seedSlides([{ _id: 's-1', ref: 'ref-1' }]);
    getScenarioErrors();
    expect(getTriggersBySlideRef).toHaveBeenCalledWith({ slideRef: 'ref-1' });
  });
});
