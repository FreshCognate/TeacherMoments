import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('axios', () => {
  const axios = vi.fn();
  axios.isCancel = vi.fn(() => false);
  return { default: axios };
});

import axios from 'axios';
import {
  createCache,
  getCache,
  resetCache,
  addCacheListener,
  removeCacheListener
} from '../helpers/cacheManager.js';

const buildContainer = (props = {}) => ({ props });

const buildCache = (key, cacheConfig = {}, container = buildContainer()) => {
  resetCache(key);
  return createCache({ key, cache: cacheConfig, container });
};

describe('cacheManager', () => {
  beforeEach(() => {
    resetCache('test');
  });

  describe('createCache / getCache / resetCache', () => {
    it('createCache stores the cache and getCache retrieves it by key', () => {
      const cache = buildCache('test', { getInitialData: () => ({ foo: 'bar' }) });
      expect(getCache('test')).toBe(cache);
      expect(getCache('test').data).toEqual({ foo: 'bar' });
    });

    it('resetCache removes the cache', () => {
      buildCache('test');
      resetCache('test');
      expect(getCache('test')).toBeUndefined();
    });

    it('defaults the status to "idle" when there is no url, listener, or resolver', () => {
      const cache = buildCache('test');
      expect(cache.status).toBe('idle');
    });

    it('defaults the status to "unresolved" when the cache has a url', () => {
      const cache = buildCache('test', { url: '/scenarios' });
      expect(cache.status).toBe('unresolved');
    });
  });

  describe('cache.set', () => {
    it('merges the update into existing data by default', async () => {
      const cache = buildCache('test', { getInitialData: () => ({ a: 1, b: 2 }) });
      await cache.set({ b: 3, c: 4 });
      expect(cache.data).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('replaces data entirely when setType is "replace"', async () => {
      const cache = buildCache('test', { getInitialData: () => ({ a: 1 }) });
      await cache.set({ b: 2 }, { setType: 'replace' });
      expect(cache.data).toEqual({ b: 2 });
    });

    it('replaces a single item by find when setType is "item"', async () => {
      const cache = buildCache('test', {
        getInitialData: () => [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]
      });
      await cache.set({ _id: '2', name: 'B' }, { setType: 'item', setFind: { _id: '2' } });
      expect(cache.data).toEqual([
        { _id: '1', name: 'a' },
        { _id: '2', name: 'B' }
      ]);
    });

    it('extends a single item by find when setType is "itemExtend"', async () => {
      const cache = buildCache('test', {
        getInitialData: () => [{ _id: '1', name: 'a', count: 0 }]
      });
      await cache.set({ count: 5 }, { setType: 'itemExtend', setFind: { _id: '1' } });
      expect(cache.data).toEqual([{ _id: '1', name: 'a', count: 5 }]);
    });

    it('writes nested keys when setType is "nested"', async () => {
      const cache = buildCache('test', {
        getInitialData: () => ({ user: { name: 'a' } })
      });
      await cache.set({ 'user.name': 'b' }, { setType: 'nested' });
      expect(cache.data).toEqual({ user: { name: 'b' } });
    });

    it('marks the cache as stale after a set', async () => {
      const cache = buildCache('test', { getInitialData: () => ({}) });
      cache.isStale = false;
      await cache.set({ x: 1 });
      expect(cache.isStale).toBe(true);
    });

    it('triggers listeners on set unless isSilent is true', async () => {
      const listener = vi.fn();
      const cache = buildCache('test', { getInitialData: () => ({}) });
      cache.listen(listener);

      await cache.set({ x: 1 });
      expect(listener).toHaveBeenCalledTimes(1);

      await cache.set({ y: 2 }, { isSilent: true });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('cache.setStatus', () => {
    it('updates status to a valid status and triggers listeners', () => {
      const cache = buildCache('test');
      const listener = vi.fn();
      cache.listen(listener);

      cache.setStatus('loading');
      expect(cache.status).toBe('loading');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('warns and does not change status when given an invalid status', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const cache = buildCache('test');

      cache.setStatus('bogus');
      expect(cache.status).not.toBe('bogus');
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe('cache.setQuery', () => {
    it('merges the query update by default', async () => {
      const cache = buildCache('test');
      await cache.setQuery({ page: 1 });
      await cache.setQuery({ size: 10 });
      expect(cache.query).toEqual({ page: 1, size: 10 });
    });

    it('replaces the query when setType is "replace"', async () => {
      const cache = buildCache('test');
      await cache.setQuery({ page: 1 });
      await cache.setQuery({ size: 10 }, { setType: 'replace' });
      expect(cache.query).toEqual({ size: 10 });
    });
  });

  describe('cache.reset', () => {
    it('restores data to whatever getInitialData returns', async () => {
      const cache = buildCache('test', { getInitialData: () => ({ count: 0 }) });

      await cache.set({ count: 5 });
      expect(cache.data).toEqual({ count: 5 });

      cache.reset();
      expect(cache.data).toEqual({ count: 0 });
    });
  });

  describe('cache.get', () => {
    it('invokes the named getter with data, attributes, and props', () => {
      const getter = vi.fn(({ data, attributes, props }) => ({ data, attributes, props }));
      const cache = buildCache(
        'test',
        { getInitialData: () => ({ x: 1 }), getters: { combined: getter } },
        buildContainer({ userId: 'u1' })
      );

      const result = cache.get('combined', { extra: true });

      expect(getter).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: { x: 1 },
        attributes: { extra: true },
        props: { userId: 'u1' }
      });
    });

    it('returns the raw data and warns when the getter is not registered', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const cache = buildCache('test', { getInitialData: () => ({ x: 1 }) });

      const result = cache.get('missing');

      expect(result).toEqual({ x: 1 });
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe('cache.hasMetDependencies', () => {
    it('returns true when all dependencies are truthy', () => {
      const cache = buildCache('test', {
        getDependencies: ({ props }) => [props.userId, props.cohortId]
      });

      expect(cache.hasMetDependencies({ props: { userId: 'u', cohortId: 'c' } })).toBe(true);
    });

    it('returns false when any dependency is falsy', () => {
      const cache = buildCache('test', {
        getDependencies: ({ props }) => [props.userId, props.cohortId]
      });

      expect(cache.hasMetDependencies({ props: { userId: 'u', cohortId: null } })).toBe(false);
    });
  });

  describe('listeners', () => {
    it('addCacheListener creates a stub cache when one does not exist yet', () => {
      resetCache('listener-only');
      const listener = vi.fn();
      addCacheListener('listener-only', listener);

      expect(getCache('listener-only').listeners).toContain(listener);
      resetCache('listener-only');
    });

    it('removeCacheListener removes the listener from the cache', () => {
      const listener = vi.fn();
      const cache = buildCache('test');
      cache.listen(listener);

      removeCacheListener('test', listener);
      cache.trigger('SET');

      expect(listener).not.toHaveBeenCalled();
    });

    it('cache.listen and cache.ignore wire add/remove on the cache', () => {
      const listener = vi.fn();
      const cache = buildCache('test');

      cache.listen(listener);
      cache.trigger('SET');
      expect(listener).toHaveBeenCalledTimes(1);

      cache.ignore(listener);
      cache.trigger('SET');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('cache.transform', () => {
    it('uses an identity transform by default (returns data unchanged)', () => {
      const cache = buildCache('test');
      expect(cache.transform({ data: { foo: 'bar' } })).toEqual({ foo: 'bar' });
    });

    it('uses a custom transform when provided in the cache config', () => {
      const cache = buildCache('test', {
        transform: ({ data }) => ({ wrapped: data })
      });
      expect(cache.transform({ data: { foo: 'bar' } })).toEqual({ wrapped: { foo: 'bar' } });
    });
  });

  describe('cache.setResolvedData', () => {
    it('sets data, marks status as "idle", and triggers listeners', () => {
      const cache = buildCache('test');
      const listener = vi.fn();
      cache.listen(listener);

      cache.setResolvedData({ data: { x: 1 } });

      expect(cache.data).toEqual({ x: 1 });
      expect(cache.status).toBe('idle');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('lifeTime and staleTime', () => {
    it('converts lifeTime and staleTime from minutes to milliseconds', () => {
      const cache = buildCache('test', { lifeTime: 5, staleTime: 2 });
      expect(cache.lifeTime).toBe(5 * 60000);
      expect(cache.staleTime).toBe(2 * 60000);
    });

    it('preserves Infinity for lifeTime and staleTime', () => {
      const cache = buildCache('test', { lifeTime: Infinity, staleTime: Infinity });
      expect(cache.lifeTime).toBe(Infinity);
      expect(cache.staleTime).toBe(Infinity);
    });
  });

  describe('isServerLoaded', () => {
    it('extends the cache object with the supplied cache config when isServerLoaded is true', () => {
      const cache = buildCache('test', {
        isServerLoaded: true,
        data: { initial: true },
        customField: 'hello'
      });

      expect(cache.isServerLoaded).toBe(true);
      expect(cache.data).toEqual({ initial: true });
      expect(cache.customField).toBe('hello');
    });
  });

  describe('cache.fetch', () => {
    beforeEach(() => {
      axios.mockReset();
    });

    it('calls axios with the resolved url, method, query and signal', async () => {
      axios.mockResolvedValueOnce({ data: { items: [1, 2] } });

      const cache = buildCache('test', {
        url: '/scenarios/:id',
        method: 'get',
        getParams: ({ props }) => ({ id: props.id })
      }, buildContainer({ id: 'abc' }));

      cache.query = { page: 2 };

      await cache.fetch({ props: { id: 'abc' } });

      expect(axios).toHaveBeenCalledTimes(1);
      const call = axios.mock.calls[0][0];
      expect(call.url).toBe('/scenarios/abc');
      expect(call.method).toBe('get');
      expect(call.params).toEqual({ page: 2 });
      expect(call.signal).toBeDefined();
    });

    it('stores transformed data and sets status to "success" on a successful fetch', async () => {
      axios.mockResolvedValueOnce({ data: { items: [1, 2] } });

      const cache = buildCache('test', {
        url: '/scenarios',
        transform: ({ data }) => ({ count: data.items.length })
      });

      await cache.fetch({ props: {} });

      expect(cache.data).toEqual({ count: 2 });
      expect(cache.status).toBe('success');
      expect(cache.isFetching).toBe(false);
    });

    it('sets status to "error" and stores the error response on rejection', async () => {
      const errorResponse = { data: { message: 'Boom' }, status: 500 };
      axios.mockRejectedValueOnce({ response: errorResponse });

      const cache = buildCache('test', { url: '/scenarios' });

      await cache.fetch({ props: {} });

      expect(cache.status).toBe('error');
      expect(cache.error).toEqual({ message: 'Boom' });
      expect(cache.isFetching).toBe(false);
    });

    it('sets status to "loading" on first fetch and "syncing" on subsequent fetches', async () => {
      axios.mockResolvedValue({ data: {} });

      const cache = buildCache('test', { url: '/scenarios' });
      const statuses = [];
      cache.listen(() => statuses.push(cache.status));

      await cache.fetch({ props: {} });
      await cache.fetch({ props: {} });

      expect(statuses[0]).toBe('loading');
      expect(statuses).toContain('syncing');
    });
  });

  describe('cache.mutate', () => {
    beforeEach(() => {
      axios.mockReset();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('applies the optimistic update immediately and sets status to "syncing"', async () => {
      const cache = buildCache('test', {
        url: '/scenarios',
        method: 'put',
        getInitialData: () => ({ name: 'old' })
      });

      cache.mutate({ update: { name: 'new' }, options: {}, props: {} });

      expect(cache.data).toEqual({ name: 'new' });
      expect(cache.status).toBe('syncing');
    });

    it('calls axios with method, url and update payload after the debounce window', async () => {
      axios.mockResolvedValueOnce({ data: { name: 'new' } });

      const cache = buildCache('test', {
        url: '/scenarios',
        method: 'put',
        getInitialData: () => ({ name: 'old' })
      });

      cache.mutate({ update: { name: 'new' }, options: {}, props: {} });

      expect(axios).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(800);

      expect(axios).toHaveBeenCalledTimes(1);
      const call = axios.mock.calls[0][0];
      expect(call.method).toBe('put');
      expect(call.url).toBe('/scenarios');
      expect(call.data).toEqual({ name: 'new' });
    });

    it('triggers the MUTATED callback after a successful response', async () => {
      axios.mockResolvedValueOnce({ data: { name: 'new' } });

      const cache = buildCache('test', {
        url: '/scenarios',
        method: 'put',
        getInitialData: () => ({})
      });

      const callback = vi.fn();
      cache.mutate({ update: { name: 'new' }, options: {}, props: {} }, callback);

      await vi.advanceTimersByTimeAsync(800);
      await vi.runAllTimersAsync();

      expect(callback).toHaveBeenCalledWith('MUTATED');
      expect(cache.status).toBe('success');
    });
  });
});
