import { describe, it, expect, vi, beforeEach } from 'vitest';

const getCacheMock = vi.fn();
vi.mock('~/core/cache/helpers/getCache', () => ({
  default: (key) => getCacheMock(key)
}));

import getFilteredTriggersByElement from '../helpers/getFilteredTriggersByElement.js';

describe('getFilteredTriggersByElement', () => {
  beforeEach(() => {
    getCacheMock.mockReset();
  });

  it('filters by elementRef and triggerType, sorted by sortOrder', () => {
    getCacheMock.mockReturnValue({
      data: [
        { _id: 't1', elementRef: 'slide-1', triggerType: 'SLIDE', sortOrder: 2 },
        { _id: 't2', elementRef: 'slide-1', triggerType: 'SLIDE', sortOrder: 0 },
        { _id: 't3', elementRef: 'slide-2', triggerType: 'SLIDE', sortOrder: 0 },
        { _id: 't4', elementRef: 'slide-1', triggerType: 'BLOCK', sortOrder: 0 },
        { _id: 't5', elementRef: 'slide-1', triggerType: 'SLIDE', sortOrder: 1 }
      ]
    });

    const result = getFilteredTriggersByElement({ elementRef: 'slide-1', triggerType: 'SLIDE' });
    expect(result.map((t) => t._id)).toEqual(['t2', 't5', 't1']);
  });

  it('returns an empty array when no triggers match', () => {
    getCacheMock.mockReturnValue({ data: [] });
    expect(getFilteredTriggersByElement({ elementRef: 'slide-99', triggerType: 'SLIDE' })).toEqual([]);
  });
});
