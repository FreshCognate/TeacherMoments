import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn()
}));

import getNextSlide from '../helpers/getNextSlide';
import getScenarioDetails from '../helpers/getScenarioDetails';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const slides = [
  { _id: 'slide-1', ref: 'ref-1', sortOrder: 0 },
  { _id: 'slide-2', ref: 'ref-2', sortOrder: 1 },
  { _id: 'slide-3', ref: 'ref-3', sortOrder: 2 }
];

const seedSlides = (data) => {
  resetCache('slides');
  createCache({
    key: 'slides',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getNextSlide', () => {
  beforeEach(() => {
    seedSlides(slides);
  });

  it('returns the first slide (sortOrder 0) when the active ref is CONSENT', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'CONSENT' });
    expect(getNextSlide()).toBe(slides[0]);
  });

  it('returns the next slide by sortOrder', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'ref-1' });
    expect(getNextSlide()).toBe(slides[1]);
  });

  it('returns the SUMMARY sentinel when on the last slide', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'ref-3' });
    expect(getNextSlide()).toEqual({ _id: 'SUMMARY', slideType: 'SUMMARY', ref: 'SUMMARY' });
  });

  it('returns undefined when the active ref does not match any slide', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'unknown' });
    expect(getNextSlide()).toBeUndefined();
  });
});
