import { describe, it, expect, beforeEach, vi } from 'vitest';

const { getScenarioDetailsMock } = vi.hoisted(() => ({
  getScenarioDetailsMock: vi.fn()
}));

vi.mock('~/modules/run/helpers/getScenarioDetails', () => ({
  default: () => getScenarioDetailsMock()
}));

import getActiveStemRef from '../helpers/getActiveStemRef';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seed = (key, data) => {
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getActiveStemRef', () => {
  beforeEach(() => {
    resetCache('slides');
    resetCache('stems');
    seed('stems', [{ ref: 'root-stem', isRoot: true }, { ref: 'child-stem', isRoot: false }]);
    seed('slides', [{ _id: 'slide-1', stemRef: 'child-stem' }]);
  });

  it('returns the stemRef of the active slide', () => {
    getScenarioDetailsMock.mockReturnValue({ activeSlideId: 'slide-1' });
    expect(getActiveStemRef()).toBe('child-stem');
  });

  it('falls back to the root stem when the active slide is a static slide', () => {
    getScenarioDetailsMock.mockReturnValue({ activeSlideId: 'CONSENT' });
    expect(getActiveStemRef()).toBe('root-stem');
  });

  it('returns null when there is no active slide stem and no root stem', () => {
    resetCache('stems');
    seed('stems', []);
    getScenarioDetailsMock.mockReturnValue({ activeSlideId: 'SUMMARY' });
    expect(getActiveStemRef()).toBeNull();
  });
});
