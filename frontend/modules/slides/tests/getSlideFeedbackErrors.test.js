import { describe, it, expect, vi, beforeEach } from 'vitest';

const getBlocksBySlideRefMock = vi.fn();
const getBlockDisplayTypeMock = vi.fn();
const hasContentMock = vi.fn();

vi.mock('~/modules/blocks/helpers/getBlocksBySlideRef', () => ({
  default: (args) => getBlocksBySlideRefMock(args)
}));

vi.mock('~/modules/blocks/helpers/getBlockDisplayType', () => ({
  default: (block) => getBlockDisplayTypeMock(block)
}));

vi.mock('~/modules/ls/helpers/hasContent', () => ({
  default: (model, field) => hasContentMock(model, field)
}));

import getSlideFeedbackErrors from '../helpers/getSlideFeedbackErrors';

const promptBlock = (overrides = {}) => ({
  _id: 'b1',
  ref: 'block-1',
  blockType: 'INPUT_PROMPT',
  ...overrides
});

const baseSlide = (overrides = {}) => ({
  _id: 'slide-1',
  ref: 'slide-ref-1',
  feedbackItems: [],
  ...overrides
});

describe('getSlideFeedbackErrors', () => {
  beforeEach(() => {
    getBlocksBySlideRefMock.mockReset();
    getBlockDisplayTypeMock.mockReset();
    hasContentMock.mockReset().mockReturnValue(true);
  });

  it('looks up blocks by the slide ref', () => {
    getBlocksBySlideRefMock.mockReturnValue([]);
    getSlideFeedbackErrors(baseSlide());
    expect(getBlocksBySlideRefMock).toHaveBeenCalledWith({ slideRef: 'slide-ref-1' });
  });

  it('reports an error against the slide when it has no prompt blocks', () => {
    getBlocksBySlideRefMock.mockReturnValue([{ blockType: 'TEXT' }]);
    getBlockDisplayTypeMock.mockReturnValue('VISUAL');

    const errors = getSlideFeedbackErrors(baseSlide());
    expect(errors).toContainEqual({
      elementType: 'SLIDE',
      elementId: 'slide-1',
      message: 'Slide has no prompt blocks to base conditions on'
    });
  });

  it('reports when more than one feedback item has no conditions', () => {
    getBlocksBySlideRefMock.mockReturnValue([promptBlock()]);
    getBlockDisplayTypeMock.mockReturnValue('PROMPT');

    const errors = getSlideFeedbackErrors(baseSlide({
      feedbackItems: [
        { _id: 'i1', conditions: [] },
        { _id: 'i2', conditions: [] }
      ]
    }));

    expect(errors.map((error) => error.message)).toContain('Only one feedback item can have no conditions');
  });

  it('does not report when only one feedback item has no conditions', () => {
    getBlocksBySlideRefMock.mockReturnValue([promptBlock()]);
    getBlockDisplayTypeMock.mockReturnValue('PROMPT');

    const errors = getSlideFeedbackErrors(baseSlide({
      feedbackItems: [{ _id: 'i1', conditions: [] }]
    }));

    expect(errors.map((error) => error.message)).not.toContain('Only one feedback item can have no conditions');
  });

  it('reports when a feedback item has no body content', () => {
    getBlocksBySlideRefMock.mockReturnValue([promptBlock()]);
    getBlockDisplayTypeMock.mockReturnValue('PROMPT');
    hasContentMock.mockReturnValue(false);

    const errors = getSlideFeedbackErrors(baseSlide({
      feedbackItems: [{ _id: 'i1', conditions: [{ prompts: [] }] }]
    }));

    expect(errors.map((error) => error.message)).toContain('Feedback item 1 has no content');
  });

  it('reports when a condition prompt has no ref', () => {
    getBlocksBySlideRefMock.mockReturnValue([promptBlock()]);
    getBlockDisplayTypeMock.mockReturnValue('PROMPT');

    const errors = getSlideFeedbackErrors(baseSlide({
      feedbackItems: [{ _id: 'i1', conditions: [{ prompts: [{ text: 'something' }] }] }]
    }));

    expect(errors.map((error) => error.message)).toContain('Condition has no prompt selected');
  });

  it('reports when a condition references a missing block', () => {
    getBlocksBySlideRefMock.mockReturnValue([promptBlock({ ref: 'block-1' })]);
    getBlockDisplayTypeMock.mockReturnValue('PROMPT');

    const errors = getSlideFeedbackErrors(baseSlide({
      feedbackItems: [{ _id: 'i1', conditions: [{ prompts: [{ ref: 'block-deleted', text: 'hello' }] }] }]
    }));

    expect(errors.map((error) => error.message)).toContain('Condition references a block that no longer exists');
  });

  it('reports when an INPUT_PROMPT condition is missing text', () => {
    getBlocksBySlideRefMock.mockReturnValue([promptBlock({ blockType: 'INPUT_PROMPT' })]);
    getBlockDisplayTypeMock.mockReturnValue('PROMPT');

    const errors = getSlideFeedbackErrors(baseSlide({
      feedbackItems: [{ _id: 'i1', conditions: [{ prompts: [{ ref: 'block-1', text: '   ' }] }] }]
    }));

    expect(errors.map((error) => error.message)).toContain('Input prompt condition needs text');
  });

  it('reports when a MULTIPLE_CHOICE_PROMPT condition has no options', () => {
    getBlocksBySlideRefMock.mockReturnValue([promptBlock({ blockType: 'MULTIPLE_CHOICE_PROMPT' })]);
    getBlockDisplayTypeMock.mockReturnValue('PROMPT');

    const errors = getSlideFeedbackErrors(baseSlide({
      feedbackItems: [{ _id: 'i1', conditions: [{ prompts: [{ ref: 'block-1', options: [] }] }] }]
    }));

    expect(errors.map((error) => error.message)).toContain('Multiple choice condition needs options selected');
  });

  it('returns no errors when everything is valid', () => {
    getBlocksBySlideRefMock.mockReturnValue([
      promptBlock({ ref: 'block-1', blockType: 'INPUT_PROMPT' }),
      promptBlock({ ref: 'block-2', blockType: 'MULTIPLE_CHOICE_PROMPT' })
    ]);
    getBlockDisplayTypeMock.mockReturnValue('PROMPT');

    const errors = getSlideFeedbackErrors(baseSlide({
      feedbackItems: [{
        _id: 'i1',
        conditions: [{
          prompts: [
            { ref: 'block-1', text: 'something' },
            { ref: 'block-2', options: ['a', 'b'] }
          ]
        }]
      }]
    }));

    expect(errors).toEqual([]);
  });
});
