import { describe, it, expect, beforeEach, vi } from 'vitest';

const { getScenarioDetailsMock } = vi.hoisted(() => ({
  getScenarioDetailsMock: vi.fn()
}));

vi.mock('~/modules/run/helpers/getScenarioDetails', () => ({
  default: () => getScenarioDetailsMock()
}));

import getSelectedSlideSortOrder from '../helpers/getSelectedSlideSortOrder';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

describe('getSelectedSlideSortOrder', () => {
  beforeEach(() => {
    resetCache('slides');
    createCache({
      key: 'slides',
      cache: { getInitialData: () => [{ _id: 'slide-1', sortOrder: 0 }, { _id: 'slide-2', sortOrder: 3 }] },
      container: { props: {} }
    });
  });

  it('returns the sort order of the active slide', () => {
    getScenarioDetailsMock.mockReturnValue({ activeSlideId: 'slide-2' });
    expect(getSelectedSlideSortOrder()).toBe(3);
  });
});
