import axios from 'axios';
import each from "lodash/each";
import includes from "lodash/includes";
import extend from "lodash/extend";
import getUrl from './getUrl';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'debounce-promise';
import pick from 'lodash/pick';
import pull from 'lodash/pull';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import set from 'lodash/set';
import has from 'lodash/has';
import handleRequestError from '~/core/app/helpers/handleRequestError';

const CACHE = {};

const STATUSES = ['unresolved', 'idle', 'loading', 'syncing', 'error', 'success'];
const STATE_ATTRIBUTES = [
  'data',
  'status',
  'query',
  'error',
  'initialData',
  'lifeTime',
  'method',
  'previousState',
  'staleTime',
  'url',
  'serverId',
  'isFetching',
  'isMounted',
  'isReady',
  'isServerLoaded',
  'isStale',
];

const defaults = {
  lifeTime: Infinity,
  staleTime: 0,
  debounceTime: 800,
};

let devTools;

const getFilteredCacheForStore = () => {
  const filteredCache = {};

  each(CACHE, (cacheValue) => {
    filteredCache[cacheValue.key] = pick(cacheValue, STATE_ATTRIBUTES);
  });

  return filteredCache;
};

const onVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    each(CACHE, (cacheSettings, cacheKey) => {
      if (cacheSettings.shouldRefetchOnWindowFocus) {
        const cache = getCache(cacheKey);
        if (cache) {
          cache.fetch({ props: cache.container.props });
        }
      }
    })
  }
}

if (typeof window !== "undefined") {
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({});
    setTimeout(() => {
      devTools.init(getFilteredCacheForStore());
    }, 0);
  }
  window.addEventListener('visibilitychange', onVisibilityChange, false)
}

const config = {};

const mutateDebounced = ({ debounceTime }) => debounce(({
  update, cache, props, options
}) => {

  cache.setPreviousState();

  cache.mutations = {};

  return axios({
    method: options.method || cache.method,
    url: getUrl({ url: cache.url, params: cache.getParams({ props }) }),
    data: update,
  }).then((response) => {
    // Only emit if there are no new mutations coming through
    if (!cache.isMutating) {
      const { data } = response;
      const transformedData = cache.transform({ data, props });

      cache.setPreviousState();

      cache.resetStale();

      let updatedData = { ...cache.data, ...transformedData };

      if (options.setType === 'replace') {
        updatedData = transformedData;
      }

      cache.data = updatedData;
      cache.status = 'success';
      cache.error = null;
      cache.response = response.data;

      cache.trigger('MUTATED');

      return { data: transformedData };

    }
  }).catch((error) => {
    if (error.response) {
      const { data } = error.response;

      cache.error = data;
      cache.response = error.response;
      cache.status = 'error';

      cache.trigger('ERRORED');

      return;
    }
    console.error(error);
  });

}, debounceTime);

export function createCache({ key, cache, container }) {

  const cacheObject = {};

  cacheObject.isServerLoaded = cache.isServerLoaded || false;

  cacheObject.container = container;

  cacheObject.shouldFetchOnLoad = true;

  if (has(cache, 'shouldFetchOnLoad')) {
    cacheObject.shouldFetchOnLoad = cache.shouldFetchOnLoad;
  }

  cacheObject.shouldRefetchOnWindowFocus = false;

  if (has(cache, 'shouldRefetchOnWindowFocus')) {
    cacheObject.shouldRefetchOnWindowFocus = cache.shouldRefetchOnWindowFocus;
  }

  cacheObject.getInitialData = () => null;

  if (cache.getInitialData) {
    cacheObject.getInitialData = cache.getInitialData;
  }

  cacheObject.initialData = cacheObject.getInitialData({ props: container.props });

  if (!cacheObject.isServerLoaded) {
    cacheObject.data = cacheObject.initialData;
  }

  cacheObject.key = key;

  cacheObject.listeners = CACHE[key] ? CACHE[key].listeners || [] : [];

  if (cache.getUrl) {
    cache.url = cache.getUrl({ props: container.props });
  }

  if (cache.url) {
    cacheObject.url = cache.url;
    cacheObject.method = cache.method || 'get';
  }

  cacheObject.getParams = () => { };

  if (cache.getParams) {
    cacheObject.getParams = cache.getParams;
  }

  if (cache.lifeTime || cache.lifeTime === 0) {
    cacheObject.lifeTime = (cache.lifeTime === Infinity) ? Infinity : cache.lifeTime * 60000;
  } else {
    cacheObject.lifeTime = defaults.lifeTime;
  }
  if (cache.staleTime || cache.staleTime === 0) {
    cacheObject.staleTime = (cache.staleTime === Infinity) ? Infinity : cache.staleTime * 60000;
  } else {
    cacheObject.staleTime = defaults.staleTime;
  }
  if (!cache.debounceTime && cache.debounceTime !== 0) {
    cacheObject.debounceTime = defaults.debounceTime;
  }

  cacheObject.transform = cache.transform;

  if (!cache.transform) {
    cacheObject.transform = (config.transform) ? config.transform : ({ data }) => data;
  }

  cacheObject.getDependencies = () => ([]);

  if (cache.getDependencies) {
    cacheObject.getDependencies = cache.getDependencies;
  }

  if (cache.getResolvedData) {
    cacheObject.getResolvedData = cache.getResolvedData;
  }

  cacheObject.isStale = true;
  cacheObject.isFetching = false;

  cacheObject.status = 'unresolved';

  if (!cacheObject.url && !cache.isListener && !cache.getResolvedData) {
    cacheObject.status = 'idle';
  }

  cacheObject.query = {};

  cacheObject.getQuery = () => ({});

  if (cache.getQuery) {
    cacheObject.getQuery = cache.getQuery;
  }

  if (cacheObject.isServerLoaded) {
    extend(cacheObject, cache);
  }

  cacheObject.reset = () => {
    cacheObject.data = cacheObject.getInitialData({ props: cacheObject.container.props });
    cacheObject.trigger('SET');
  };

  cacheObject.set = (update, options = {}) => {

    let updatedData;

    cacheObject.setPreviousState();

    if (options.setType === 'replace') {
      updatedData = update;
    } else if (options.setType === 'item') {
      const index = findIndex(cacheObject.data, options.setFind);
      cacheObject.data.splice(index, 1, update);
      updatedData = cloneDeep(cacheObject.data);
    } else if (options.setType === 'itemExtend') {
      const item = find(cacheObject.data, options.setFind);
      extend(item, update);
      updatedData = cloneDeep(cacheObject.data);
    } else if (options.setType === 'nested') {
      each(update, (value, key) => {
        set(cacheObject.data, key, value);
      });
      updatedData = cloneDeep(cacheObject.data);
    } else {
      updatedData = { ...cacheObject.data, ...update };
    }

    cacheObject.data = updatedData;
    cacheObject.isStale = true;

    cacheObject.trigger('SET');

    return new Promise((resolve) => {
      resolve();
    });

  };

  cacheObject.fetch = ({ props }) => {

    cacheObject.setPreviousState();

    cacheObject.isFetching = true;
    cacheObject.status = (cacheObject.status === 'idle' || cacheObject.status === 'unresolved') ? 'loading' : 'syncing';

    cacheObject.trigger('STATUS');

    cacheObject.setPreviousState();

    const fetchPromise = axios({
      method: cacheObject.method,
      url: getUrl({ url: cacheObject.url, params: cacheObject.getParams({ props }) }),
      params: cacheObject.query,
    }).catch(handleRequestError);

    return fetchPromise.then((response) => {
      const { data } = response;

      cacheObject.resetStale();

      cacheObject.isFetching = false;

      cacheObject.data = cacheObject.transform({ data, props });
      cacheObject.response = data;
      cacheObject.status = 'success';

      cacheObject.trigger('FETCHED');

    }).catch((error) => {
      if (error.response) {
        const { data } = error.response;

        cacheObject.isStale = true;
        cacheObject.isFetching = false;

        cacheObject.error = data;
        cacheObject.response = error.response;
        cacheObject.status = 'error';

        cacheObject.trigger('ERRORED');
        return;
      }
      console.error(error);
    });
  };

  cacheObject.mutate = ({ update, options, props }, callback) => {

    const payload = update || cacheObject.data;

    if (cacheObject.isMutating) {
      // Need to store the mutations
      cacheObject.mutations = { ...cacheObject.mutations || {}, ...payload };
    } else {
      cacheObject.setPreviousState();
      cacheObject.mutations = payload;
    }

    cacheObject.isMutating = true;

    if (cacheObject.status !== 'syncing') {
      cacheObject.status = 'syncing';
      cacheObject.trigger('STATUS');
    }

    const setReturn = cacheObject.set(update, options);

    clearTimeout(cacheObject.mutatedDebounce);

    cacheObject.mutatedDebounce = setTimeout(() => {

      let update = { ...cacheObject.mutations };

      cacheObject.isMutating = false;

      return axios({
        method: options.method || cacheObject.method,
        url: getUrl({ url: cacheObject.url, params: cacheObject.getParams({ props }) }),
        data: update,
      }).then((response) => {
        // Only emit if there are no new mutations coming through
        if (!cacheObject.isMutating) {
          const { data } = response;
          const transformedData = cacheObject.transform({ data, props });

          cacheObject.resetStale();

          let updatedData = { ...cacheObject.data, ...transformedData };

          if (options.setType === 'replace') {
            updatedData = transformedData;
          }

          cacheObject.data = updatedData;
          cacheObject.status = 'success';
          cacheObject.error = null;
          cacheObject.response = response.data;

          cacheObject.trigger('MUTATED');

          setTimeout(() => {
            if (callback) {
              callback('MUTATED');
            }
          }, 0);

        }
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response;

          cacheObject.error = data;
          cacheObject.response = error.response;
          cacheObject.status = 'error';

          cacheObject.trigger('ERRORED');

          setTimeout(() => {
            if (callback) {
              callback('ERRORED');
            }
          }, 0);
        }
        handleRequestError(error);
        console.error(error);
      });


    }, defaults.debounceTime)

    return setReturn;

  };

  cacheObject.setStatus = (status) => {
    if (!includes(STATUSES, status)) return console.warn(`Status can only be one of the following: ${STATUSES}. You are trying to set it as: ${status}`);
    cacheObject.setPreviousState();
    cacheObject.status = status;
    cacheObject.trigger('STATUS');
  };

  cacheObject.setResolvedData = ({ data }) => {
    cacheObject.setPreviousState();
    cacheObject.data = data;
    cacheObject.status = 'idle';
    cacheObject.trigger('RESOLVED');
  };

  cacheObject.setPreviousState = () => {
    cacheObject.previousState = {
      data: cloneDeep(cacheObject.data),
      status: cacheObject.status,
      isStale: cacheObject.isStale,
      response: cacheObject.response
    };
  };

  cacheObject.resetStale = () => {
    cacheObject.isStale = false;
    if (cacheObject.staleTime === Infinity) return;
    if (cacheObject.staleTime === 0) {
      cacheObject.isStale = true;
      return;
    }

    cacheObject.staleId = setTimeout(() => {
      cacheObject.isStale = true;
    }, cacheObject.staleTime);
  };

  cacheObject.startGarbageCollection = () => {
    if (cacheObject.isMounted) return;
    if (cacheObject.lifeTime === Infinity) return;
    cacheObject.garbageCollectionId = setTimeout(() => {
      resetCache(cacheObject.key);
    }, cacheObject.lifeTime);
  };

  cacheObject.stopGarbageCollection = () => {
    if (cacheObject.garbageCollectionId) {
      clearInterval(cacheObject.garbageCollectionId);
    }
  };

  cacheObject.hasMetDependencies = ({
    props,
  }) => {
    cacheObject.dependencies = cacheObject.getDependencies({ props });
    let hasValidDependencies = true;
    each(cacheObject.dependencies, (dependency) => {
      if (!dependency) {
        hasValidDependencies = false;
      }
    });
    return hasValidDependencies;

  };

  cacheObject.trigger = (type) => {
    each(cacheObject.listeners, (listener) => {
      listener();
    });
    if (devTools) {
      devTools.send({ type: `${cacheObject.key}:${type}` }, getFilteredCacheForStore());
    }
  };

  cacheObject.setQuery = (update, options = {}) => {

    if (options.setType === 'replace') {
      cacheObject.query = update;
    } else {
      cacheObject.query = { ...cacheObject.query, ...update };
    }

    return new Promise((resolve) => {
      resolve();
    });

  };

  cacheObject.listen = (callback) => {
    addCacheListener(key, callback);
  };

  cacheObject.ignore = (callback) => {
    removeCacheListener(key, callback);
  };

  CACHE[key] = cacheObject;

  return CACHE[key];
}

export function getCache(key) {
  return CACHE[key];
}

export function addCacheListener(key, listener) {
  if (CACHE[key]) {
    CACHE[key].listeners.push(listener);
  } else {
    CACHE[key] = {
      listeners: [listener]
    };
  }
}

export function removeCacheListener(key, listener) {
  if (CACHE[key]) {
    pull(CACHE[key].listeners, listener);
  }
}

export function resetCache(key) {
  delete CACHE[key];
}