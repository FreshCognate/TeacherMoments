import { describe, it, expect, beforeEach } from 'vitest';
import setUserPreferences from '../helpers/setUserPreferences';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

const seedRun = (data) => {
  resetCache('run');
  createCache({
    key: 'run',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('setUserPreferences', () => {
  beforeEach(() => {
    seedRun({});
  });

  it('writes the preferences to the run cache when none exist', () => {
    setUserPreferences({ theme: 'dark' });
    expect(getCache('run').data.preferences).toEqual({ theme: 'dark' });
  });

  it('extends existing preferences instead of replacing them', () => {
    seedRun({ preferences: { theme: 'dark', layout: 'cosy' } });

    setUserPreferences({ theme: 'light' });

    expect(getCache('run').data.preferences).toEqual({
      theme: 'light',
      layout: 'cosy'
    });
  });
});
