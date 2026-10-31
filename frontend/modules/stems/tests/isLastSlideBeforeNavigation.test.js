import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getActiveStemMock, getChildStemsMock, getLastStemSlideMock } = vi.hoisted(() => ({
  getActiveStemMock: vi.fn(),
  getChildStemsMock: vi.fn(),
  getLastStemSlideMock: vi.fn()
}));

vi.mock('../helpers/getActiveStem', () => ({
  default: () => getActiveStemMock()
}));
vi.mock('../helpers/getChildStems', () => ({
  default: (options) => getChildStemsMock(options)
}));
vi.mock('~/modules/slides/helpers/getLastStemSlide', () => ({
  default: () => getLastStemSlideMock()
}));

import isLastSlideBeforeNavigation from '../helpers/isLastSlideBeforeNavigation';

describe('isLastSlideBeforeNavigation', () => {
  beforeEach(() => {
    getActiveStemMock.mockReturnValue({ ref: 'stem-1' });
    getLastStemSlideMock.mockReturnValue({ _id: 'slide-3' });
  });

  it('returns false when the active stem has no navigation', () => {
    getChildStemsMock.mockReturnValue([]);
    expect(isLastSlideBeforeNavigation({ slideId: 'slide-3' })).toBe(false);
  });

  it('returns true for the last slide when the active stem has navigation', () => {
    getChildStemsMock.mockReturnValue([{ ref: 'child-stem' }]);
    expect(isLastSlideBeforeNavigation({ slideId: 'slide-3' })).toBe(true);
  });

  it('returns false for a slide that is not last when the active stem has navigation', () => {
    getChildStemsMock.mockReturnValue([{ ref: 'child-stem' }]);
    expect(isLastSlideBeforeNavigation({ slideId: 'slide-2' })).toBe(false);
  });

  it('returns false when the stem has no slides', () => {
    getChildStemsMock.mockReturnValue([{ ref: 'child-stem' }]);
    getLastStemSlideMock.mockReturnValue(undefined);
    expect(isLastSlideBeforeNavigation({ slideId: 'slide-3' })).toBe(false);
  });
});
