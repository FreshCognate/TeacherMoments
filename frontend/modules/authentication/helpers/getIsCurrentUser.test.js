import { describe, it, expect, beforeEach } from 'vitest';
import getIsCurrentUser from './getIsCurrentUser.js';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedAuth = (data) => {
  resetCache('authentication');
  createCache({
    key: 'authentication',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getIsCurrentUser', () => {
  beforeEach(() => {
    seedAuth({ _id: 'u-123' });
  });

  it('returns true when the userId matches the cached user', () => {
    expect(getIsCurrentUser('u-123')).toBe(true);
  });

  it('returns false when the userId does not match', () => {
    expect(getIsCurrentUser('someone-else')).toBe(false);
  });
});
