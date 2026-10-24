import { describe, it, expect, vi, beforeEach } from 'vitest';

const getBlocksBySlideRefMock = vi.fn();
const getBlockErrorsMock = vi.fn();

vi.mock('~/modules/blocks/helpers/getBlocksBySlideRef', () => ({
  default: (args) => getBlocksBySlideRefMock(args)
}));

vi.mock('~/modules/blocks/helpers/getBlockErrors', () => ({
  default: (block) => getBlockErrorsMock(block)
}));

const getStemErrorsMock = vi.fn();
vi.mock('~/modules/stems/helpers/getStemErrors', () => ({
  default: (stem) => getStemErrorsMock(stem)
}));

const getSlideFeedbackErrorsMock = vi.fn();
vi.mock('../helpers/getSlideFeedbackErrors', () => ({
  default: (slide) => getSlideFeedbackErrorsMock(slide)
}));

import getSlideErrors from '../helpers/getSlideErrors';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager.js';

const seedCache = (key, data) => {
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getSlideErrors', () => {
  beforeEach(() => {
    getBlocksBySlideRefMock.mockReset();
    getBlockErrorsMock.mockReset();
    getSlideFeedbackErrorsMock.mockReset().mockReturnValue([]);
    getStemErrorsMock.mockReset().mockReturnValue([]);
    resetCache('stems');
    resetCache('slides');
  });

  it('returns "Slide has no blocks" when the slide has no blocks', () => {
    getBlocksBySlideRefMock.mockReturnValue([]);
    const errors = getSlideErrors({ _id: 's1', ref: 'slide-1' });
    expect(errors).toEqual([
      { message: 'Slide has no blocks', elementType: 'SLIDE', elementId: 's1' }
    ]);
  });

  it('returns "Slide has no blocks" when blocks helper returns undefined', () => {
    getBlocksBySlideRefMock.mockReturnValue(undefined);
    const errors = getSlideErrors({ _id: 's1', ref: 'slide-1' });
    expect(errors[0].message).toBe('Slide has no blocks');
  });

  it('aggregates block errors when blocks exist', () => {
    getBlocksBySlideRefMock.mockReturnValue([
      { _id: 'b1', blockType: 'TEXT' },
      { _id: 'b2', blockType: 'INPUT_PROMPT' }
    ]);
    getBlockErrorsMock
      .mockReturnValueOnce([{ message: 'Missing title', elementType: 'BLOCK', elementId: 'b1' }])
      .mockReturnValueOnce([{ message: 'Missing prompt text', elementType: 'BLOCK', elementId: 'b2' }]);

    const errors = getSlideErrors({ _id: 's1', ref: 'slide-1' });

    expect(errors).toEqual([
      { message: 'Missing title', elementType: 'BLOCK', elementId: 'b1' },
      { message: 'Missing prompt text', elementType: 'BLOCK', elementId: 'b2' }
    ]);
  });

  it('returns no errors when blocks exist and have no errors of their own', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);
    expect(getSlideErrors({ _id: 's1', ref: 'slide-1' })).toEqual([]);
  });

  it('checks the stem when the slide is the last slide in its stem', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);
    const stem = { _id: 'st1', ref: 'stem-1' };
    seedCache('stems', [stem]);
    seedCache('slides', [
      { _id: 's1', ref: 'slide-1', stemRef: 'stem-1', sortOrder: 0 },
      { _id: 's2', ref: 'slide-2', stemRef: 'stem-1', sortOrder: 1 }
    ]);

    getSlideErrors({ _id: 's2', ref: 'slide-2', stemRef: 'stem-1', sortOrder: 1 });

    expect(getStemErrorsMock).toHaveBeenCalledTimes(1);
    expect(getStemErrorsMock).toHaveBeenCalledWith(stem);
  });

  it('does not check the stem when the slide is not the last slide in its stem', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);
    seedCache('stems', [{ _id: 'st1', ref: 'stem-1' }]);
    seedCache('slides', [
      { _id: 's1', ref: 'slide-1', stemRef: 'stem-1', sortOrder: 0 },
      { _id: 's2', ref: 'slide-2', stemRef: 'stem-1', sortOrder: 1 }
    ]);

    getSlideErrors({ _id: 's1', ref: 'slide-1', stemRef: 'stem-1', sortOrder: 0 });

    expect(getStemErrorsMock).not.toHaveBeenCalled();
  });

  it('aggregates stem errors after block errors', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([{ message: 'Missing title', elementType: 'BLOCK', elementId: 'b1' }]);
    seedCache('stems', [{ _id: 'st1', ref: 'stem-1' }]);
    seedCache('slides', [{ _id: 's1', ref: 'slide-1', stemRef: 'stem-1', sortOrder: 0 }]);
    getStemErrorsMock.mockReturnValue([{ message: 'Stem error', elementType: 'STEM', elementId: 'st1' }]);

    expect(getSlideErrors({ _id: 's1', ref: 'slide-1', stemRef: 'stem-1', sortOrder: 0 })).toEqual([
      { message: 'Missing title', elementType: 'BLOCK', elementId: 'b1' },
      { message: 'Stem error', elementType: 'STEM', elementId: 'st1' }
    ]);
  });

  it('includes feedback errors when the slide has feedback turned on', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);
    getSlideFeedbackErrorsMock.mockReturnValue([
      { message: 'Feedback item 1 has no content', elementType: 'SLIDE', elementId: 's1' }
    ]);
    const slide = { _id: 's1', ref: 'slide-1', hasFeedback: true };

    expect(getSlideErrors(slide)).toEqual([
      { message: 'Feedback item 1 has no content', elementType: 'SLIDE', elementId: 's1' }
    ]);
    expect(getSlideFeedbackErrorsMock).toHaveBeenCalledWith(slide);
  });

  it('does not check feedback when the slide has feedback turned off', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);

    getSlideErrors({ _id: 's1', ref: 'slide-1', hasFeedback: false });

    expect(getSlideFeedbackErrorsMock).not.toHaveBeenCalled();
  });
});
