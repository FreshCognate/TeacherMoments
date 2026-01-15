import React, { Component } from 'react';
import each from 'lodash/each';
import isEqual from 'lodash/isEqual';
import extend from 'lodash/extend';

import { createCache, getCache, addCacheListener, removeCacheListener, resetCache } from '../helpers/cacheManager';

const WithCache = (Component, cacheObject = {}, listeners = []) => {

  return class extends React.Component {

    constructor(props, context) {
      super(props, context);

      this._isMounted = false;

      this.cacheKeys = [];

      this.caches = {};

      each(cacheObject, (cacheValue, cacheKey) => {

        let cache = getCache(cacheKey);

        if (cacheValue.isServerLoaded) {
          if (props[cacheKey]) {
            cacheValue = extend({}, props[cacheKey], cacheValue);
          } else {
            console.warn(`${Component.prototype.constructor.displayName} - ${cacheKey}: No server data is passed down. Check the route and make sure the useLoaderData is used to pass data down.`);
          }
        }

        cache = createCache({ key: cacheKey, cache: cacheValue, container: this });

        this.cacheKeys.push(cacheKey);

        if (cacheValue.isServerLoaded) {

          if (typeof window !== 'undefined') {
            cache.trigger('SERVER_LOADED');
          }

        }

        this.caches[cacheKey] = cache;

      });

      this.cacheListenersKeys = listeners;

      this.cacheKeys = this.cacheKeys.concat(listeners);

    };

    componentDidMount = () => {

      each(this.caches, (cache) => {

        addCacheListener(cache.key, this.onCacheUpdated);

        // This is the main cache that will handle all fetch and syncing

        cache.isMounted = true;

        cache.isResolved = cache.hasMetDependencies({ props: this.props });

        cache.params = cache.getParams({ props: this.props });

        cache.stopGarbageCollection({ cache });

        if (!cache.isResolved) {
          if (cache.status !== 'unresolved') {
            cache.setStatus('unresolved');
          };
          return;
        }

        if (!cache.url) {
          if (cache.status !== 'idle') {
            cache.setStatus('idle');
          };
          return;
        }

        if (cache.url && cache.isResolved && cache.method === 'get' && cache.isStale) {
          if (cache.isServerLoaded) {
            cache.resetStale();
            return;
          }
          cache.query = cache.getQuery({ props: this.props });
          if (cache.shouldFetchOnLoad) {
            cache.fetch({ props: this.props });
          }
        }

        // TODO: This needs a bit more investigation
        if (cache.isResolved && cache.getResolvedData) {
          // Goes from unresolved to resolved
          if (cache.status === 'unresolved') {
            cache.setResolvedData({
              data: cache.getResolvedData({
                props: this.props
              })
            });
          }
        }

      });

      each(this.cacheListenersKeys, (cacheKey) => {
        addCacheListener(cacheKey, this.onCacheUpdated);
      });

      this._isMounted = true;
    };

    componentDidUpdate = (prevProps) => {

      // Check for any props changes that make a difference
      each(this.caches, (cache) => {

        let hasParamChanges = false;
        let hasDependencyChanges = false;

        const params = cache.getParams({ props: this.props });

        if (!isEqual(cache.params, params)) {
          cache.params = params;
          hasParamChanges = true;
        }

        const dependencies = cache.getDependencies({ props: this.props });

        if (!isEqual(cache.dependencies, dependencies)) {
          cache.dependencies = dependencies;
          hasDependencyChanges = true;
        }

        if (hasParamChanges || hasDependencyChanges) {
          setTimeout(() => {

            this.onUpdate(cache);
          }, 0);
        }

      });
    };

    componentWillUnmount = () => {

      this._isMounted = false;
      each(this.caches, (cache) => {

        removeCacheListener(cache.key, this.onCacheUpdated);
        cache.isMounted = false;
        cache.isReady = false;
        cache.startGarbageCollection({ cache });

      });

    };

    onCacheUpdated = () => {
      if (this._isMounted) {
        this.setState({});
      }
    };

    onUpdate = (cache) => {

      if (cache.hasMetDependencies({ props: this.props })) {
        cache.isResolved = true;

        if (cache.getResolvedData) {
          cache.setResolvedData({
            data: cache.getResolvedData({ props: this.props })
          });
        }

        if (!cache.url) {
          if (cache.status !== 'idle') {
            cache.setStatus('idle');
          }
          return;
        }

        if (cache.method === 'get' && cache.url) {
          // Will be the first time this is resolved so reset query object
          cache.query = cache.getQuery({ props: this.props });
          // Fetch will auto set the status to either loading or syncing
          cache.fetch({ props: this.props });
        } else if (cache.status === 'unresolved') {
          cache.setStatus('idle');
        }

      } else {
        if (cache.status === 'unresolved') return;
        cache.isResolved = false;
        cache.setStatus('unresolved');
      }

    };

    getCaches = () => {
      const caches = {};

      each(this.cacheKeys, (cacheKey) => {
        const cache = getCache(cacheKey) || {};

        caches[cacheKey] = {
          data: cache.data,
          previousState: cache.previousState,
          query: cache.query,
          response: cache.response,
          get: cache.get,
          set: cache.set,
          setStatus: cache.setStatus,
          status: cache.status,
          setQuery: cache.setQuery,
          reset: cache.reset,
          mutate: (update, options, callback) => cache.mutate({ update, options, props: this.props }, callback),
          fetch: () => cache.fetch({ props: this.props })
        };
      });

      return caches;
    };

    render() {

      const WrappedComponent = Component;

      const caches = this.getCaches();

      return <WrappedComponent {...this.props} {...caches} />;

    }
  };

};

export default WithCache;
