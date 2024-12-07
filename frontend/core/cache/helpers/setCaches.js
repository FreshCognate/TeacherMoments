import { getCache } from './cacheManager';
import each from 'lodash/each';
import extend from 'lodash/extend';

export default (serverData) => {

  each(serverData, (cacheValue, cacheKey) => {

    const cache = getCache(cacheKey);

    if (cache) {
      extend(cache, cacheValue);
    }

  });
};