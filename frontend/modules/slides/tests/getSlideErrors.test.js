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

describe('getSlideErrors', () => {
  beforeEach(() => {
    getBlocksBySlideRefMock.mockReset();
    getBlockErrorsMock.mockReset();
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
});
