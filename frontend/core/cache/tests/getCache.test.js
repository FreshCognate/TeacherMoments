import { describe, it, expect, beforeEach } from 'vitest';
import getCache from '../helpers/getCache.js';
import { createCache, resetCache } from '../helpers/cacheManager.js';

const buildContainer = (props = {}) => ({ props });

describe('getCache (wrapper)', () => {
  beforeEach(() => {
    resetCache('test-key');
  });

  it('returns an empty object when the cache for the key does not exist', () => {
    expect(getCache('nonexistent-key')).toEqual({});
  });

  it('returns the cache data and exposed methods when the cache exists', () => {
    createCache({
      key: 'test-key',
      cache: { getInitialData: () => ({ count: 1 }) },
      container: buildContainer()
    });

    const wrapped = getCache('test-key');

    expect(wrapped.data).toEqual({ count: 1 });
    expect(typeof wrapped.set).toBe('function');
    expect(typeof wrapped.setStatus).toBe('function');
    expect(typeof wrapped.get).toBe('function');
    expect(typeof wrapped.fetch).toBe('function');
    expect(typeof wrapped.mutate).toBe('function');
    expect(typeof wrapped.reset).toBe('function');
  });

  it('reflects the cache status', () => {
    createCache({
      key: 'test-key',
      cache: {},
      container: buildContainer()
    });

    expect(getCache('test-key').status).toBe('idle');
  });
});
