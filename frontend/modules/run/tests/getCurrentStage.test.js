import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn()
}));

import getCurrentStage from '../helpers/getCurrentStage';
import getScenarioDetails from '../helpers/getScenarioDetails';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

const seed = (key, data) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const setEditorPathname = () => {
  window.history.replaceState({}, '', '/scenarios/scenario-1/create');
};

describe('getCurrentStage', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    setEditorPathname();
    seed('blocks', []);
    seed('run', { stages: [] });
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('returns null when there is no active slide', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: null });
    expect(getCurrentStage()).toBeNull();
  });

  it('returns the existing stage when one matches the active slide', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'slide-1' });
    seed('run', {
      stages: [{ slideRef: 'slide-1', isComplete: true }]
    });
    expect(getCurrentStage()).toEqual({ slideRef: 'slide-1', isComplete: true });
  });

  it('returns null and does not write to the run cache when no stage matches', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'slide-1' });
    const set = vi.spyOn(getCache('run'), 'set');

    expect(getCurrentStage()).toBeNull();
    expect(set).not.toHaveBeenCalled();
    expect(getCache('run').data.stages).toHaveLength(0);
  });
});
