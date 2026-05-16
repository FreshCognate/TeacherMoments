import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn(() => ({ activeSlideRef: 'ref-1' }))
}));

import getSlideStatus from '../helpers/getSlideStatus';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedRun = (data) => {
  resetCache('run');
  createCache({
    key: 'run',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getSlideStatus', () => {
  beforeEach(() => {
    seedRun({ stages: [] });
  });

  it('returns the status from the matching stage', () => {
    seedRun({
      stages: [{ slideRef: 'ref-1', status: 'IN_PROGRESS' }]
    });
    expect(getSlideStatus()).toBe('IN_PROGRESS');
  });

  it('returns undefined when no stage matches', () => {
    seedRun({ stages: [{ slideRef: 'other', status: 'IN_PROGRESS' }] });
    expect(getSlideStatus()).toBeUndefined();
  });
});
