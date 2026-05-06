import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../helpers/navigateTo', () => ({
  default: vi.fn()
}));
vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn()
}));

import navigateBack from '../helpers/navigateBack';
import navigateTo from '../helpers/navigateTo';
import getScenarioDetails from '../helpers/getScenarioDetails';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedSlides = (data) => {
  resetCache('slides');
  createCache({
    key: 'slides',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const slides = [
  { _id: 's-1', ref: 'ref-1', sortOrder: 0 },
  { _id: 's-2', ref: 'ref-2', sortOrder: 1 },
  { _id: 's-3', ref: 'ref-3', sortOrder: 2 }
];

describe('navigateBack', () => {
  const originalUrl = window.location.href;
  const router = {};

  beforeEach(() => {
    navigateTo.mockClear();
    seedSlides(slides);
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('navigates to the slide with the highest sortOrder when on SUMMARY', async () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'SUMMARY' });
    await navigateBack({ router });
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'ref-3', router });
  });

  it('navigates to CONSENT when on the first slide (sortOrder 0)', async () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'ref-1' });
    await navigateBack({ router });
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'CONSENT', router });
  });

  it('navigates to the previous slide by sortOrder', async () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'ref-3' });
    await navigateBack({ router });
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'ref-2', router });
  });

  it('does nothing when the active slide is not in the slides cache', async () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'unknown' });
    await navigateBack({ router });
    expect(navigateTo).not.toHaveBeenCalled();
  });
});
