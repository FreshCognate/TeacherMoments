import { describe, it, expect, beforeEach } from 'vitest';
import getIsEditor from '../helpers/getIsEditor';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedAuth = (data: any) => {
  resetCache('authentication');
  createCache({
    key: 'authentication',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getIsEditor', () => {
  beforeEach(() => {
    resetCache('authentication');
  });

  it.each(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])(
    'returns true for the %s role',
    (role) => {
      seedAuth({ role });
      expect(getIsEditor()).toBe(true);
    }
  );

  it('returns false for the USER role', () => {
    seedAuth({ role: 'USER' });
    expect(getIsEditor()).toBe(false);
  });

  it('returns false when no authentication is cached', () => {
    seedAuth({});
    expect(getIsEditor()).toBe(false);
  });
});
