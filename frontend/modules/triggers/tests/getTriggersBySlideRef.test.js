import { describe, it, expect, vi, beforeEach } from 'vitest';

const getCacheMock = vi.fn();
vi.mock('~/core/cache/helpers/getCache', () => ({
  default: (key) => getCacheMock(key)
}));

import getTriggersBySlideRef from '../helpers/getTriggersBySlideRef.js';

describe('getTriggersBySlideRef', () => {
  beforeEach(() => {
    getCacheMock.mockReset();
  });

  it('returns only triggers whose elementRef matches the given slideRef', () => {
    getCacheMock.mockReturnValue({
      data: [
        { _id: 't1', elementRef: 'slide-1', action: 'SHOW' },
        { _id: 't2', elementRef: 'slide-2', action: 'SHOW' },
        { _id: 't3', elementRef: 'slide-1', action: 'OTHER' }
      ]
    });

    const result = getTriggersBySlideRef({ slideRef: 'slide-1' });
    expect(result.map((t) => t._id)).toEqual(['t1', 't3']);
  });

  it('returns an empty array when no triggers match', () => {
    getCacheMock.mockReturnValue({
      data: [{ _id: 't1', elementRef: 'slide-2' }]
    });
    expect(getTriggersBySlideRef({ slideRef: 'slide-99' })).toEqual([]);
  });
});
