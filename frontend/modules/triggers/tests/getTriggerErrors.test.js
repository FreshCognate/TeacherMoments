import { describe, it, expect, vi, beforeEach } from 'vitest';

const getBlocksBySlideRefMock = vi.fn();
const getBlockDisplayTypeMock = vi.fn();
const hasContentMock = vi.fn();
const getCacheMock = vi.fn();

vi.mock('~/core/cache/helpers/getCache', () => ({
  default: (key) => getCacheMock(key)
}));

vi.mock('~/modules/blocks/helpers/getBlocksBySlideRef', () => ({
  default: (args) => getBlocksBySlideRefMock(args)
}));

vi.mock('~/modules/blocks/helpers/getBlockDisplayType', () => ({
  default: (block) => getBlockDisplayTypeMock(block)
}));

vi.mock('~/modules/ls/helpers/hasContent', () => ({
  default: (model, field) => hasContentMock(model, field)
}));

import getTriggerErrors from '../helpers/getTriggerErrors.js';

const promptBlock = (overrides = {}) => ({
  _id: 'b1',
  ref: 'block-1',
  blockType: 'INPUT_PROMPT',
  ...overrides
});

const baseTrigger = (overrides = {}) => ({
  _id: 'trigger-1',
  action: 'SHOW_FEEDBACK_FROM_PROMPTS',
  elementRef: 'slide-1',
  items: [],
  ...overrides
});

const setStems = (stems) => {
  getCacheMock.mockImplementation((key) => (key === 'stems' ? { data: stems } : { data: [] }));
};

describe('getTriggerErrors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hasContentMock.mockReturnValue(true);
    setStems([]);
  });

  it('returns no errors for unknown actions', () => {
    expect(getTriggerErrors({ _id: 't1', action: 'UNKNOWN_ACTION' })).toEqual([]);
  });

  describe('SHOW_FEEDBACK_FROM_PROMPTS', () => {
    it('reports an error when the slide has no prompt blocks', () => {
      getBlocksBySlideRefMock.mockReturnValue([{ blockType: 'TEXT' }]);
      getBlockDisplayTypeMock.mockReturnValue('VISUAL');

      const errors = getTriggerErrors(baseTrigger());
      expect(errors).toContainEqual({
        elementType: 'TRIGGER',
        elementId: 'trigger-1',
        message: 'Slide has no prompt blocks to base conditions on'
      });
    });

    it('reports when more than one feedback item has no conditions', () => {
      getBlocksBySlideRefMock.mockReturnValue([promptBlock()]);
      getBlockDisplayTypeMock.mockReturnValue('PROMPT');

      const errors = getTriggerErrors(baseTrigger({
        items: [
          { _id: 'i1', conditions: [] },
          { _id: 'i2', conditions: [] }
        ]
      }));

      expect(errors.map((e) => e.message)).toContain('Only one feedback item can have no conditions');
    });

    it('does not report when only one feedback item has no conditions', () => {
      getBlocksBySlideRefMock.mockReturnValue([promptBlock()]);
      getBlockDisplayTypeMock.mockReturnValue('PROMPT');

      const errors = getTriggerErrors(baseTrigger({
        items: [{ _id: 'i1', conditions: [] }]
      }));

      expect(errors.map((e) => e.message)).not.toContain('Only one feedback item can have no conditions');
    });

    it('reports when a feedback item has no body content', () => {
      getBlocksBySlideRefMock.mockReturnValue([promptBlock()]);
      getBlockDisplayTypeMock.mockReturnValue('PROMPT');
      hasContentMock.mockReturnValue(false);

      const errors = getTriggerErrors(baseTrigger({
        items: [{ _id: 'i1', conditions: [{ prompts: [] }] }]
      }));

      expect(errors.map((e) => e.message)).toContain('Feedback item 1 has no content');
    });

    it('reports when a condition prompt has no ref', () => {
      getBlocksBySlideRefMock.mockReturnValue([promptBlock()]);
      getBlockDisplayTypeMock.mockReturnValue('PROMPT');

      const errors = getTriggerErrors(baseTrigger({
        items: [{
          _id: 'i1',
          conditions: [{ prompts: [{ text: 'something' }] }]
        }]
      }));

      expect(errors.map((e) => e.message)).toContain('Condition has no prompt selected');
    });

    it('reports when a condition references a missing block', () => {
      getBlocksBySlideRefMock.mockReturnValue([promptBlock({ ref: 'block-1' })]);
      getBlockDisplayTypeMock.mockReturnValue('PROMPT');

      const errors = getTriggerErrors(baseTrigger({
        items: [{
          _id: 'i1',
          conditions: [{ prompts: [{ ref: 'block-deleted', text: 'hello' }] }]
        }]
      }));

      expect(errors.map((e) => e.message)).toContain('Condition references a block that no longer exists');
    });

    it('reports when an INPUT_PROMPT condition is missing text', () => {
      getBlocksBySlideRefMock.mockReturnValue([promptBlock({ blockType: 'INPUT_PROMPT' })]);
      getBlockDisplayTypeMock.mockReturnValue('PROMPT');

      const errors = getTriggerErrors(baseTrigger({
        items: [{
          _id: 'i1',
          conditions: [{ prompts: [{ ref: 'block-1', text: '   ' }] }]
        }]
      }));

      expect(errors.map((e) => e.message)).toContain('Input prompt condition needs text');
    });

    it('reports when a MULTIPLE_CHOICE_PROMPT condition has no options', () => {
      getBlocksBySlideRefMock.mockReturnValue([promptBlock({ blockType: 'MULTIPLE_CHOICE_PROMPT' })]);
      getBlockDisplayTypeMock.mockReturnValue('PROMPT');

      const errors = getTriggerErrors(baseTrigger({
        items: [{
          _id: 'i1',
          conditions: [{ prompts: [{ ref: 'block-1', options: [] }] }]
        }]
      }));

      expect(errors.map((e) => e.message)).toContain('Multiple choice condition needs options selected');
    });

    it('returns no errors when everything is valid', () => {
      getBlocksBySlideRefMock.mockReturnValue([
        promptBlock({ ref: 'block-1', blockType: 'INPUT_PROMPT' }),
        promptBlock({ ref: 'block-2', blockType: 'MULTIPLE_CHOICE_PROMPT' })
      ]);
      getBlockDisplayTypeMock.mockReturnValue('PROMPT');

      const errors = getTriggerErrors(baseTrigger({
        items: [{
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

  describe('BRANCH_TO_STEM_FROM_PROMPTS', () => {
    const slideStems = [
      { _id: 's1', ref: 'stem-1', name: 'Calm', slideRef: 'slide-1' },
      { _id: 's2', ref: 'stem-2', name: 'Firm', slideRef: 'slide-1' }
    ];

    const branchTrigger = (overrides = {}) => baseTrigger({
      action: 'BRANCH_TO_STEM_FROM_PROMPTS',
      ...overrides
    });

    beforeEach(() => {
      setStems(slideStems);
      getBlocksBySlideRefMock.mockReturnValue([promptBlock({ ref: 'block-1', blockType: 'INPUT_PROMPT' })]);
      getBlockDisplayTypeMock.mockReturnValue('PROMPT');
    });

    it('reports when an item has no stem to branch to', () => {
      const errors = getTriggerErrors(branchTrigger({
        items: [{
          _id: 'i1',
          conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }]
        }]
      }));

      expect(errors.map((e) => e.message)).toContain('Branch 1 has no stem to branch to');
    });

    it('reports when an item branches to a stem that no longer exists', () => {
      const errors = getTriggerErrors(branchTrigger({
        items: [{
          _id: 'i1',
          elementRef: 'stem-deleted',
          conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }]
        }]
      }));

      expect(errors.map((e) => e.message)).toContain('Branch 1 branches to a stem that no longer exists');
    });

    it('reports a condition with no prompts set', () => {
      const errors = getTriggerErrors(branchTrigger({
        items: [{ _id: 'i1', elementRef: 'stem-1', conditions: [{}] }]
      }));

      expect(errors.map((e) => e.message)).toContain('Stem "Calm" has a condition with no prompts set');
    });

    it('does not report when every stem has conditions', () => {
      const errors = getTriggerErrors(branchTrigger({
        items: [{
          _id: 'i1',
          elementRef: 'stem-1',
          conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }]
        }]
      }));

      expect(errors).toEqual([]);
    });

    it('reports when two stems use the same condition, ignoring option and prompt order', () => {
      getBlocksBySlideRefMock.mockReturnValue([
        promptBlock({ ref: 'block-1', blockType: 'INPUT_PROMPT' }),
        promptBlock({ ref: 'block-2', blockType: 'MULTIPLE_CHOICE_PROMPT' })
      ]);

      const errors = getTriggerErrors(branchTrigger({
        items: [{
          _id: 'i1',
          elementRef: 'stem-1',
          conditions: [{
            prompts: [
              { ref: 'block-1', text: 'Yes' },
              { ref: 'block-2', options: ['a', 'b'] }
            ]
          }]
        }, {
          _id: 'i2',
          elementRef: 'stem-2',
          conditions: [{
            prompts: [
              { ref: 'block-2', options: ['b', 'a'] },
              { ref: 'block-1', text: '  yes  ' }
            ]
          }]
        }]
      }));

      expect(errors.map((e) => e.message))
        .toContain('More than one stem uses the same condition: Stem "Calm", Stem "Firm"');
    });

    it('does not report duplicates when the conditions differ', () => {
      const errors = getTriggerErrors(branchTrigger({
        items: [{
          _id: 'i1',
          elementRef: 'stem-1',
          conditions: [{ prompts: [{ ref: 'block-1', text: 'yes' }] }]
        }, {
          _id: 'i2',
          elementRef: 'stem-2',
          conditions: [{ prompts: [{ ref: 'block-1', text: 'no' }] }]
        }]
      }));

      expect(errors.map((e) => e.message).join(' ')).not.toContain('use the same condition');
    });

    it('does not require body content on branch items', () => {
      hasContentMock.mockReturnValue(false);

      const errors = getTriggerErrors(branchTrigger({
        items: [{
          _id: 'i1',
          elementRef: 'stem-1',
          conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }]
        }]
      }));

      expect(errors).toEqual([]);
    });

    it('reports when more than one stem is left without conditions', () => {
      const errors = getTriggerErrors(branchTrigger({ items: [] }));

      expect(errors.map((e) => e.message)).toContain('Only one stem can have no conditions');
    });

    it('does not report when exactly one stem is left without conditions', () => {
      const errors = getTriggerErrors(branchTrigger({
        items: [{ _id: 'i1', elementRef: 'stem-1', conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }] }]
      }));

      expect(errors.map((e) => e.message)).not.toContain('Only one stem can have no conditions');
    });

    it('counts a stem whose conditions were all removed as one without conditions', () => {
      const errors = getTriggerErrors(branchTrigger({
        items: [
          { _id: 'i1', elementRef: 'stem-1', conditions: [] },
          { _id: 'i2', elementRef: 'stem-2', conditions: [] }
        ]
      }));

      expect(errors.map((e) => e.message)).toContain('Only one stem can have no conditions');
    });

    it('reports a missing default only once every stem has conditions', () => {
      const errors = getTriggerErrors(branchTrigger({
        items: [
          { _id: 'i1', elementRef: 'stem-1', conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }] },
          { _id: 'i2', elementRef: 'stem-2', conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }] }
        ]
      }));

      expect(errors.map((e) => e.message)).toContain('No default stem set');
    });

    it('reports a default stem that no longer exists', () => {
      const errors = getTriggerErrors(branchTrigger({
        defaultStemRef: 'stem-deleted',
        items: [
          { _id: 'i1', elementRef: 'stem-1', conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }] },
          { _id: 'i2', elementRef: 'stem-2', conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }] }
        ]
      }));

      expect(errors.map((e) => e.message)).toContain('Default stem no longer exists');
    });

    it('ignores a dormant default while a stem is still without conditions', () => {
      const errors = getTriggerErrors(branchTrigger({
        defaultStemRef: 'stem-deleted',
        items: [{ _id: 'i1', elementRef: 'stem-1', conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }] }]
      }));

      expect(errors).toEqual([]);
    });

    it('returns no errors when every stem has conditions and a default is set', () => {
      const errors = getTriggerErrors(branchTrigger({
        defaultStemRef: 'stem-2',
        items: [
          { _id: 'i1', elementRef: 'stem-1', conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }] },
          { _id: 'i2', elementRef: 'stem-2', conditions: [{ prompts: [{ ref: 'block-1', text: 'other' }] }] }
        ]
      }));

      expect(errors).toEqual([]);
    });

    it('returns no errors when one stem catches everything and no default is set', () => {
      const errors = getTriggerErrors(branchTrigger({
        items: [{ _id: 'i1', elementRef: 'stem-1', conditions: [{ prompts: [{ ref: 'block-1', text: 'something' }] }] }]
      }));

      expect(errors).toEqual([]);
    });
  });
});
