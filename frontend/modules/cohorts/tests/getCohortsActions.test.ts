import { describe, it, expect, beforeEach } from 'vitest';
import getCohortsActions from '../helpers/getCohortsActions';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedAuth = (data: any) => {
  resetCache('authentication');
  createCache({
    key: 'authentication',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getCohortsActions', () => {
  beforeEach(() => {
    seedAuth({});
  });

  it('returns an empty array when the user is not an editor', () => {
    seedAuth({ role: 'USER' });
    expect(getCohortsActions()).toEqual([]);
  });

  it('returns a CREATE action when the user is an ADMIN', () => {
    seedAuth({ role: 'ADMIN' });
    expect(getCohortsActions()).toEqual([
      { action: 'CREATE', text: 'Create cohort', color: 'primary' }
    ]);
  });

  it('returns a CREATE action when the user is a FACILITATOR', () => {
    seedAuth({ role: 'FACILITATOR' });
    expect(getCohortsActions()).toEqual([
      { action: 'CREATE', text: 'Create cohort', color: 'primary' }
    ]);
  });
});
