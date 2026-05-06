import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../helpers/navigateTo', () => ({
  default: vi.fn()
}));

import resetScenario from '../helpers/resetScenario';
import navigateTo from '../helpers/navigateTo';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

const seed = (key, data) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('resetScenario', () => {
  beforeEach(() => {
    navigateTo.mockClear();
  });

  it('replaces the run cache with an empty object and navigates to the first slide', () => {
    seed('slides', [
      { _id: 's-1', ref: 'ref-1', sortOrder: 0 },
      { _id: 's-2', ref: 'ref-2', sortOrder: 1 }
    ]);
    seed('run', { existing: true });

    const router = {};
    resetScenario({ router });

    expect(getCache('run').data).toEqual({});
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'ref-1', router });
  });

  it('navigates with a null slideRef when the slides cache is empty', () => {
    seed('slides', []);
    seed('run', {});

    const router = {};
    resetScenario({ router });

    expect(navigateTo).toHaveBeenCalledWith({ slideRef: null, router });
  });
});
