import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../helpers/navigateTo', () => ({
  default: vi.fn()
}));
vi.mock('../helpers/getNextSlide', () => ({
  default: vi.fn()
}));

import navigateToNextSlide from '../helpers/navigateToNextSlide';
import navigateTo from '../helpers/navigateTo';
import getNextSlide from '../helpers/getNextSlide';

describe('navigateToNextSlide', () => {
  const router = {};

  beforeEach(() => {
    navigateTo.mockClear();
  });

  it('navigates to the ref returned by getNextSlide', async () => {
    getNextSlide.mockReturnValue({ ref: 'ref-2' });
    await navigateToNextSlide({ router });
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'ref-2', router });
  });

  it('navigates to the SUMMARY ref when getNextSlide returns the summary sentinel', async () => {
    getNextSlide.mockReturnValue({ _id: 'SUMMARY', ref: 'SUMMARY' });
    await navigateToNextSlide({ router });
    expect(navigateTo).toHaveBeenCalledWith({ slideRef: 'SUMMARY', router });
  });
});
