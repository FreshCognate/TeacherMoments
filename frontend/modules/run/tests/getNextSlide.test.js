import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn()
}));

import getNextSlide from '../helpers/getNextSlide';
import getScenarioDetails from '../helpers/getScenarioDetails';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seed = (key, data) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const stems = [
  { ref: 'stem-root', isRoot: true },
  { ref: 'stem-nested', isRoot: false, slideRef: 'root-1' },
  { ref: 'stem-tail', isRoot: false, slideRef: 'root-3' }
];

const slides = [
  { _id: '1', ref: 'root-1', sortOrder: 0, stemRef: 'stem-root' },
  { _id: '2', ref: 'root-2', sortOrder: 1, stemRef: 'stem-root' },
  { _id: '3', ref: 'root-3', sortOrder: 2, stemRef: 'stem-root' },
  { _id: '4', ref: 'nested-1', sortOrder: 0, stemRef: 'stem-nested' },
  { _id: '5', ref: 'nested-2', sortOrder: 1, stemRef: 'stem-nested' },
  { _id: '6', ref: 'tail-1', sortOrder: 0, stemRef: 'stem-tail' }
];

const slideByRef = (ref) => slides.find((slide) => slide.ref === ref);

describe('getNextSlide', () => {
  beforeEach(() => {
    seed('slides', slides);
    seed('stems', stems);
  });

  it('returns the first slide (sortOrder 0) when the active ref is CONSENT', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'CONSENT' });
    expect(getNextSlide()).toBe(slideByRef('root-1'));
  });

  it('returns the next slide in the same stem by sortOrder', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'root-1' });
    expect(getNextSlide()).toBe(slideByRef('root-2'));
  });

  it('returns the SUMMARY sentinel on the last slide of the root stem', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'root-3' });
    expect(getNextSlide()).toEqual({ _id: 'SUMMARY', slideType: 'SUMMARY', ref: 'SUMMARY' });
  });

  it('returns to the parent stem next slide after the last slide of a nested stem', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'nested-2' });
    expect(getNextSlide()).toBe(slideByRef('root-2'));
  });

  it('returns undefined when a nested stem ends and the parent has no next slide', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'tail-1' });
    expect(getNextSlide()).toBeUndefined();
  });

  it('returns undefined when the active ref does not match any slide', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'unknown' });
    expect(getNextSlide()).toBeUndefined();
  });
});
