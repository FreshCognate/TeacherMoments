import { describe, it, expect, beforeEach } from 'vitest';
import getScenariosActions from '../helpers/getScenariosActions';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedAuth = (data: any) => {
  resetCache('authentication');
  createCache({
    key: 'authentication',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getScenariosActions', () => {
  beforeEach(() => {
    seedAuth({});
  });

  it('returns an empty array when the user is not an editor', () => {
    seedAuth({ role: 'USER' });
    expect(getScenariosActions()).toEqual([]);
  });

  it('returns a CREATE action when the user is an ADMIN', () => {
    seedAuth({ role: 'ADMIN' });
    expect(getScenariosActions()).toEqual([
      { action: 'CREATE', text: 'Create scenario', color: 'primary' }
    ]);
  });

  it('returns a CREATE action when the user is a FACILITATOR', () => {
    seedAuth({ role: 'FACILITATOR' });
    expect(getScenariosActions()).toEqual([
      { action: 'CREATE', text: 'Create scenario', color: 'primary' }
    ]);
  });
});
