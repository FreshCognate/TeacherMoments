import { describe, it, expect, beforeEach } from 'vitest';
import getCohortsFilters from '../helpers/getCohortsFilters';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedAuth = (data: any) => {
  resetCache('authentication');
  createCache({
    key: 'authentication',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getCohortsFilters', () => {
  beforeEach(() => {
    seedAuth({});
  });

  it('returns an empty array when the user is not an editor', () => {
    seedAuth({ role: 'USER' });
    expect(getCohortsFilters()).toEqual([]);
  });

  it('returns Live and Archived filters when the user is an editor', () => {
    seedAuth({ role: 'ADMIN' });
    expect(getCohortsFilters()).toEqual([
      { value: false, text: 'Live' },
      { value: true, text: 'Archived' }
    ]);
  });
});
