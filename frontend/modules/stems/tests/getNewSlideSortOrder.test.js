import { describe, it, expect, vi } from 'vitest';

const { getScenarioDetailsMock, getCurrentStemSlidesMock, getSelectedSlideSortOrderMock } = vi.hoisted(() => ({
  getScenarioDetailsMock: vi.fn(),
  getCurrentStemSlidesMock: vi.fn(),
  getSelectedSlideSortOrderMock: vi.fn()
}));

vi.mock('~/modules/run/helpers/getScenarioDetails', () => ({
  default: () => getScenarioDetailsMock()
}));
vi.mock('../helpers/getCurrentStemSlides', () => ({
  default: () => getCurrentStemSlidesMock()
}));
vi.mock('../helpers/getSelectedSlideSortOrder', () => ({
  default: () => getSelectedSlideSortOrderMock()
}));

import getNewSlideSortOrder from '../helpers/getNewSlideSortOrder';

describe('getNewSlideSortOrder', () => {
  it('inserts at the start when the consent slide is active', () => {
    getScenarioDetailsMock.mockReturnValue({ activeSlideId: 'CONSENT' });
    expect(getNewSlideSortOrder()).toBe(0);
  });

  it('appends to the active stem when the summary slide is active', () => {
    getScenarioDetailsMock.mockReturnValue({ activeSlideId: 'SUMMARY' });
    getCurrentStemSlidesMock.mockReturnValue([{ _id: 'slide-1' }, { _id: 'slide-2' }]);
    expect(getNewSlideSortOrder()).toBe(2);
  });

  it('inserts after the selected slide', () => {
    getScenarioDetailsMock.mockReturnValue({ activeSlideId: 'slide-1' });
    getSelectedSlideSortOrderMock.mockReturnValue(4);
    expect(getNewSlideSortOrder()).toBe(5);
  });
});
