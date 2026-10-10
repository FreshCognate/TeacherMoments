import { describe, it, expect, beforeEach, vi } from 'vitest';

const { getActiveStemRefMock } = vi.hoisted(() => ({
  getActiveStemRefMock: vi.fn()
}));

vi.mock('../helpers/getActiveStemRef', () => ({
  default: () => getActiveStemRefMock()
}));

import getActiveStem from '../helpers/getActiveStem';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

describe('getActiveStem', () => {
  beforeEach(() => {
    resetCache('stems');
    createCache({
      key: 'stems',
      cache: { getInitialData: () => [{ ref: 'stem-1' }, { ref: 'stem-2' }] },
      container: { props: {} }
    });
  });

  it('returns the stem matching the active stem ref', () => {
    getActiveStemRefMock.mockReturnValue('stem-2');
    expect(getActiveStem()).toEqual({ ref: 'stem-2' });
  });

  it('returns undefined when no stem matches', () => {
    getActiveStemRefMock.mockReturnValue(null);
    expect(getActiveStem()).toBeUndefined();
  });
});
