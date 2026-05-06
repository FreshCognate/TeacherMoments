import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import setScenarioToArchived from '../helpers/setScenarioToArchived';
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

describe('setScenarioToArchived', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seedRun({});
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('sets isArchived on the run cache in edit mode', async () => {
    await setScenarioToArchived();
    expect(getCache('run').data.isArchived).toBe(true);
  });

  it('mutates the run cache via PUT in play mode and resolves once the callback fires', async () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate').mockImplementation(
      ({ update }, callback) => {
        getCache('run').data = { ...getCache('run').data, ...update };
        callback();
      }
    );

    await setScenarioToArchived();

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { isArchived: true },
        options: { method: 'put' }
      }),
      expect.any(Function)
    );
  });
});
