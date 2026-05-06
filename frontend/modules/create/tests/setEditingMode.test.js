import { describe, it, expect, beforeEach, vi } from 'vitest';
import setEditingMode from '../helpers/setEditingMode';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

describe('setEditingMode', () => {
  let runResetSpy;

  beforeEach(() => {
    resetCache('editor');
    resetCache('run');

    createCache({
      key: 'editor',
      cache: { getInitialData: () => ({ displayMode: 'PREVIEW' }) },
      container: { props: {} }
    });
    createCache({
      key: 'run',
      cache: { getInitialData: () => ({ isStarted: true }) },
      container: { props: {} }
    });

    runResetSpy = vi.spyOn(getCache('run'), 'reset');
  });

  it('sets the editor displayMode to EDITING', () => {
    setEditingMode();
    expect(getCache('editor').data.displayMode).toBe('EDITING');
  });

  it('resets the run cache', () => {
    setEditingMode();
    expect(runResetSpy).toHaveBeenCalledTimes(1);
  });
});
