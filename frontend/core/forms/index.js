import { createCache } from '~/core/cache/helpers/cacheManager';

createCache({
  key: 'forms',
  cache: {
    getInitialData() {
      return { selectedItemId: null };
    }
  },
  container: { props: {} }
});
