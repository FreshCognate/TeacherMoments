import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getActiveStemMock, getChildStemsMock, getCurrentStemSlidesMock } = vi.hoisted(() => ({
  getActiveStemMock: vi.fn(),
  getChildStemsMock: vi.fn(),
  getCurrentStemSlidesMock: vi.fn()
}));

vi.mock('../helpers/getActiveStem', () => ({
  default: () => getActiveStemMock()
}));
vi.mock('../helpers/getChildStems', () => ({
  default: (options) => getChildStemsMock(options)
}));
vi.mock('../helpers/getCurrentStemSlides', () => ({
  default: () => getCurrentStemSlidesMock()
}));

import getIsSortingLastSlideBeforeNavigation from '../helpers/getIsSortingLastSlideBeforeNavigation';

describe('getIsSortingLastSlideBeforeNavigation', () => {
  beforeEach(() => {
    getActiveStemMock.mockReturnValue({ ref: 'stem-1' });
    getChildStemsMock.mockReturnValue([{ ref: 'child-stem' }]);
    getCurrentStemSlidesMock.mockReturnValue([{ _id: 'slide-1' }, { _id: 'slide-2' }, { _id: 'slide-3' }]);
  });

  it('returns true when dropping a slide after the last slide', () => {
    expect(getIsSortingLastSlideBeforeNavigation({ sourceIndex: 0, destinationIndex: 3 })).toBe(true);
  });

  it('returns true when moving the last slide earlier in the stem', () => {
    expect(getIsSortingLastSlideBeforeNavigation({ sourceIndex: 2, destinationIndex: 0 })).toBe(true);
  });

  it('returns false when the move does not involve the last slide', () => {
    expect(getIsSortingLastSlideBeforeNavigation({ sourceIndex: 0, destinationIndex: 2 })).toBe(false);
  });

  it('returns false when the source and destination are the same', () => {
    expect(getIsSortingLastSlideBeforeNavigation({ sourceIndex: 2, destinationIndex: 2 })).toBe(false);
  });

  it('returns false when the active stem has no branching options', () => {
    getChildStemsMock.mockReturnValue([]);
    expect(getIsSortingLastSlideBeforeNavigation({ sourceIndex: 0, destinationIndex: 3 })).toBe(false);
  });

  it('checks the branching options of the active stem', () => {
    getIsSortingLastSlideBeforeNavigation({ sourceIndex: 0, destinationIndex: 3 });
    expect(getChildStemsMock).toHaveBeenCalledWith({ stem: { ref: 'stem-1' } });
  });
});
