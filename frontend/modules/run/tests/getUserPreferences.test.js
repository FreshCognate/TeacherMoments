import { describe, it, expect, beforeEach } from 'vitest';
import getUserPreferences from '../helpers/getUserPreferences';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedRun = (data) => {
  resetCache('run');
  createCache({
    key: 'run',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getUserPreferences', () => {
  beforeEach(() => {
    seedRun({});
  });

  it('returns the preferences from the run cache when present', () => {
    seedRun({ preferences: { theme: 'dark' } });
    expect(getUserPreferences()).toEqual({ theme: 'dark' });
  });

  it('returns an empty object when there are no preferences', () => {
    expect(getUserPreferences()).toEqual({});
  });
});
