import { getCache as getCacheByKey } from "./cacheManager";

export default function getCache(key) {
  const cache = getCacheByKey(key);

  if (!cache) return {};

  return {
    data: cache.data,
    status: cache.status,
    set: cache.set,
    setStatus: cache.setStatus,
    get: cache.get,
    fetch: () => {
      if (cache.container) {
        return cache.fetch({ props: cache.container.props })
      }
    },
    mutate: (update, options, callback) => cache.mutate({ update, options, props: cache.container.props }, callback),
    listen: cache.listen,
    ignore: cache.ignore,
    reset: cache.reset,
    query: cache.query
  };
}