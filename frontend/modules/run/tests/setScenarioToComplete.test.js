import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import setScenarioToComplete from '../helpers/setScenarioToComplete';
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

describe('setScenarioToComplete', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seedRun({});
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('sets isComplete on the run cache in edit mode', () => {
    setScenarioToComplete();
    expect(getCache('run').data.isComplete).toBe(true);
  });

  it('mutates the run cache via PUT in play mode', () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    setScenarioToComplete();

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { isComplete: true },
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
