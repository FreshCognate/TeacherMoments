import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn(() => ({ activeSlideRef: 'ref-1' }))
}));

import setShouldStopNavigation from '../helpers/setShouldStopNavigation';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

const seedRun = (data) => {
  resetCache('run');
  createCache({
    key: 'run',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const setEditorPathname = () => {
  window.history.replaceState({}, '', '/scenarios/scenario-1/create');
};

const setPlayPathname = () => {
  window.history.replaceState({}, '', '/play/scenario-1');
};

describe('setShouldStopNavigation', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seedRun({ stages: [{ slideRef: 'ref-1' }] });
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('sets shouldStopNavigation on the active stage in edit mode', () => {
    setShouldStopNavigation(true);
    expect(getCache('run').data.stages[0].shouldStopNavigation).toBe(true);
  });

  it('passes the value through as-is', () => {
    setShouldStopNavigation(false);
    expect(getCache('run').data.stages[0].shouldStopNavigation).toBe(false);
  });

  it('mutates the run cache via PUT in play mode', () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    setShouldStopNavigation(true);

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          stages: expect.arrayContaining([
            expect.objectContaining({ slideRef: 'ref-1', shouldStopNavigation: true })
          ])
        }),
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
