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
  { ref: 'stem-nested', isRoot: false, slideRef: 'root-2' }
];

const slides = [
  { _id: '1', ref: 'root-1', sortOrder: 0, stemRef: 'stem-root' },
  { _id: '2', ref: 'root-2', sortOrder: 1, stemRef: 'stem-root' },
  { _id: '3', ref: 'root-3', sortOrder: 2, stemRef: 'stem-root' },
  { _id: '4', ref: 'nested-1', sortOrder: 0, stemRef: 'stem-nested' },
  { _id: '5', ref: 'nested-2', sortOrder: 1, stemRef: 'stem-nested' }
];

describe('navigateBack', () => {
  const originalUrl = window.location.href;
  const router = {};

  beforeEach(() => {
    navigateTo.mockClear();
    seed('slides', slides);
    seed('stems', stems);
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('navigates to the last root slide by sortOrder when on SUMMARY', async () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'SUMMARY' });
    await navigateBack({ router });
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'root-3', router });
  });

  it('does not navigate from SUMMARY when the root stem has no slides', async () => {
    seed('slides', []);
    seed('stems', [{ ref: 'stem-root', isRoot: true }]);
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'SUMMARY' });
    await navigateBack({ router });
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('navigates to CONSENT from the first slide of the root stem', async () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'root-1' });
    await navigateBack({ router });
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'CONSENT', router });
  });

  it('navigates to the parent slide from the first slide of a nested stem', async () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'nested-1' });
    await navigateBack({ router });
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'root-2', router });
    expect(navigateTo).toHaveBeenCalledTimes(1);
  });

  it('navigates to the previous slide in the same stem by sortOrder', async () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'root-3' });
    await navigateBack({ router });
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'root-2', router });
  });

  it('does not navigate when there is no previous slide in the stem', async () => {
    seed('slides', [{ _id: 'g', ref: 'gap-1', sortOrder: 1, stemRef: 'stem-gap' }]);
    seed('stems', [{ ref: 'stem-gap', isRoot: true }]);
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'gap-1' });
    await navigateBack({ router });
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('does nothing when the active slide is not in the slides cache', async () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'unknown' });
    await navigateBack({ router });
    expect(navigateTo).not.toHaveBeenCalled();
  });
});
