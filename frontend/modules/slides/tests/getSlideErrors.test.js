import { describe, it, expect, vi, beforeEach } from 'vitest';

const getBlocksBySlideRefMock = vi.fn();
const getBlockErrorsMock = vi.fn();

vi.mock('~/modules/blocks/helpers/getBlocksBySlideRef', () => ({
  default: (args) => getBlocksBySlideRefMock(args)
}));

vi.mock('~/modules/blocks/helpers/getBlockErrors', () => ({
  default: (block) => getBlockErrorsMock(block)
}));

import getSlideErrors from '../helpers/getSlideErrors.js';
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
    resetCache('stems');
    resetCache('triggers');
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
  it('flags a slide that has stems but no triggers to branch with', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);
    seedCache('stems', [{ ref: 'stem-1', slideRef: 'slide-1' }]);
    seedCache('triggers', []);

    const errors = getSlideErrors({ _id: 's1', ref: 'slide-1' });

    expect(errors).toEqual([
      { message: 'Slide with stems has no branching trigger', elementType: 'SLIDE_TRIGGER', elementId: 's1' }
    ]);
  });

  it('does not flag a slide whose stems have a branching trigger', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);
    seedCache('stems', [{ ref: 'stem-1', slideRef: 'slide-1' }]);
    seedCache('triggers', [{ _id: 't1', elementRef: 'slide-1', action: 'BRANCH_TO_STEM_FROM_PROMPTS' }]);

    expect(getSlideErrors({ _id: 's1', ref: 'slide-1' })).toEqual([]);
  });

  it('does not flag a slide with no stems, whether or not it has triggers', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);
    seedCache('stems', [{ ref: 'stem-1', slideRef: 'another-slide' }]);
    seedCache('triggers', []);

    expect(getSlideErrors({ _id: 's1', ref: 'slide-1' })).toEqual([]);
  });

  it('ignores triggers that belong to a different slide', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);
    seedCache('stems', [{ ref: 'stem-1', slideRef: 'slide-1' }]);
    seedCache('triggers', [{ _id: 't1', elementRef: 'another-slide', action: 'BRANCH_TO_STEM_FROM_PROMPTS' }]);

    expect(getSlideErrors({ _id: 's1', ref: 'slide-1' })[0].elementType).toBe('SLIDE_TRIGGER');
  });
  it('flags a slide whose only trigger shows feedback rather than branching', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ _id: 'b1' }]);
    getBlockErrorsMock.mockReturnValue([]);
    seedCache('stems', [{ ref: 'stem-1', slideRef: 'slide-1' }]);
    seedCache('triggers', [{ _id: 't1', elementRef: 'slide-1', action: 'SHOW_FEEDBACK_FROM_PROMPTS' }]);

    expect(getSlideErrors({ _id: 's1', ref: 'slide-1' })).toEqual([
      { message: 'Slide with stems has no branching trigger', elementType: 'SLIDE_TRIGGER', elementId: 's1' }
    ]);
  });
});
