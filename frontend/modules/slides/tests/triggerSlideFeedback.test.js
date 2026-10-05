import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getBlocksBySlideRefMock,
  getSlideFeedbackErrorsMock,
  setSlideStatusMock,
  getBlockTrackingMock,
  generateMock,
  setSlideFeedbackResponsesMock,
  setSlideFeedbackItemsMock
} = vi.hoisted(() => ({
  getBlocksBySlideRefMock: vi.fn(),
  getSlideFeedbackErrorsMock: vi.fn(),
  setSlideStatusMock: vi.fn(),
  getBlockTrackingMock: vi.fn(),
  generateMock: vi.fn(),
  setSlideFeedbackResponsesMock: vi.fn(),
  setSlideFeedbackItemsMock: vi.fn()
}));

vi.mock('~/modules/blocks/helpers/getBlocksBySlideRef', () => ({
  default: (args) => getBlocksBySlideRefMock(args)
}));
vi.mock('../helpers/getSlideFeedbackErrors', () => ({
  default: (slide) => getSlideFeedbackErrorsMock(slide)
}));
vi.mock('~/modules/run/helpers/setSlideStatus', () => ({
  default: (status) => setSlideStatusMock(status)
}));
vi.mock('~/modules/blocks/helpers/getBlockDisplayType', () => ({
  default: () => 'PROMPT'
}));
vi.mock('~/modules/ls/helpers/getString', () => ({
  default: ({ model }) => model.text
}));
vi.mock('~/modules/run/helpers/getBlockTracking', () => ({
  default: (args) => getBlockTrackingMock(args)
}));
vi.mock('~/modules/generate/helpers/generate', () => ({
  default: (args) => generateMock(args)
}));
vi.mock('~/modules/run/helpers/setSlideFeedbackResponses', () => ({
  default: (feedbackResponses) => setSlideFeedbackResponsesMock(feedbackResponses)
}));
vi.mock('~/modules/run/helpers/setSlideFeedbackItems', () => ({
  default: (feedbackItems) => setSlideFeedbackItemsMock(feedbackItems)
}));

import triggerSlideFeedback from '../helpers/triggerSlideFeedback';

const multipleChoiceBlock = { ref: 'block-mc', blockType: 'MULTIPLE_CHOICE_PROMPT', text: 'Pick one' };
const inputBlock = { ref: 'block-input', blockType: 'INPUT_PROMPT', text: 'Explain' };

const matchingFeedbackItem = {
  _id: 'feedback-item-1',
  text: 'Matched feedback',
  conditions: [{ _id: 'condition-1', prompts: [{ ref: 'block-mc', options: ['a'] }] }]
};

const fallbackFeedbackItem = {
  _id: 'feedback-item-2',
  text: 'Fallback feedback',
  conditions: []
};

const buildSlide = (overrides = {}) => ({
  _id: 'slide-1',
  ref: 'slide-ref-1',
  name: 'Slide 1',
  shouldGenerateFeedbackFromAI: false,
  feedbackItems: [matchingFeedbackItem, fallbackFeedbackItem],
  ...overrides
});

describe('triggerSlideFeedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSlideFeedbackErrorsMock.mockReturnValue([]);
    getBlocksBySlideRefMock.mockReturnValue([multipleChoiceBlock]);
  });

  it('skips the slide when it has feedback errors', async () => {
    getSlideFeedbackErrorsMock.mockReturnValue([{ message: 'Invalid' }]);
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    await triggerSlideFeedback({ slide: buildSlide() });

    expect(setSlideStatusMock).not.toHaveBeenCalled();
    expect(setSlideFeedbackItemsMock).not.toHaveBeenCalled();
    expect(setSlideFeedbackResponsesMock).not.toHaveBeenCalled();
  });

  it('returns the feedback of items whose multiple choice conditions match', async () => {
    getBlockTrackingMock.mockReturnValue({ selectedOptions: ['a'] });

    await triggerSlideFeedback({ slide: buildSlide() });

    expect(setSlideFeedbackResponsesMock).toHaveBeenCalledWith(['Matched feedback']);
    expect(setSlideFeedbackItemsMock).toHaveBeenCalledWith([{
      blockRef: 'block-mc',
      blockType: 'MULTIPLE_CHOICE_PROMPT',
      conditions: [{
        conditionId: 'condition-1',
        feedbackItemId: 'feedback-item-1',
        score: 1,
        reasoning: undefined
      }]
    }]);
  });

  it('falls back to the conditionless feedback item when nothing matches', async () => {
    getBlockTrackingMock.mockReturnValue({ selectedOptions: ['b'] });

    await triggerSlideFeedback({ slide: buildSlide() });

    expect(setSlideFeedbackResponsesMock).toHaveBeenCalledWith(['Fallback feedback']);
  });

  it('scores input prompt conditions with the generated match', async () => {
    getBlocksBySlideRefMock.mockReturnValue([inputBlock]);
    getBlockTrackingMock.mockReturnValue({ textValue: 'My answer' });
    generateMock.mockResolvedValue({
      payload: { conditions: [{ _id: 'condition-1', score: 0.9, reasoning: 'Close match' }] }
    });

    const inputFeedbackItem = {
      _id: 'feedback-item-1',
      text: 'Input feedback',
      conditions: [{ _id: 'condition-1', prompts: [{ ref: 'block-input', text: 'Mentions planning' }] }]
    };

    await triggerSlideFeedback({ slide: buildSlide({ feedbackItems: [inputFeedbackItem] }) });

    expect(generateMock).toHaveBeenCalledWith({
      generateType: 'USER_INPUT_PROMPT_MATCHES_CONDITION_PROMPT',
      payload: {
        stem: 'Explain',
        usersAnswer: 'My answer',
        conditions: [{ _id: 'condition-1', condition: 'Mentions planning' }]
      }
    });
    expect(setSlideFeedbackResponsesMock).toHaveBeenCalledWith(['Input feedback']);
  });

  it('does not match input prompt conditions scored below the threshold', async () => {
    getBlocksBySlideRefMock.mockReturnValue([inputBlock]);
    getBlockTrackingMock.mockReturnValue({ textValue: 'My answer' });
    generateMock.mockResolvedValue({
      payload: { conditions: [{ _id: 'condition-1', score: 0.5 }] }
    });

    const inputFeedbackItem = {
      _id: 'feedback-item-1',
      text: 'Input feedback',
      conditions: [{ _id: 'condition-1', prompts: [{ ref: 'block-input', text: 'Mentions planning' }] }]
    };

    await triggerSlideFeedback({
      slide: buildSlide({ feedbackItems: [inputFeedbackItem, fallbackFeedbackItem] })
    });

    expect(setSlideFeedbackResponsesMock).toHaveBeenCalledWith(['Fallback feedback']);
  });

  it('generates the feedback from the matched items when AI feedback is turned on', async () => {
    getBlockTrackingMock.mockReturnValue({ selectedOptions: ['a'] });
    generateMock.mockResolvedValue({ payload: { feedback: 'Generated feedback' } });

    await triggerSlideFeedback({ slide: buildSlide({ shouldGenerateFeedbackFromAI: true }) });

    expect(generateMock).toHaveBeenCalledWith(expect.objectContaining({
      generateType: 'FEEDBACK_FROM_FEEDBACK_ITEMS',
      payload: expect.objectContaining({ feedbackItems: ['Matched feedback'] })
    }));
    expect(setSlideFeedbackResponsesMock).toHaveBeenCalledWith(['Generated feedback']);
  });

  it('clears the slide status once feedback is set', async () => {
    getBlockTrackingMock.mockReturnValue({ selectedOptions: ['a'] });

    await triggerSlideFeedback({ slide: buildSlide() });

    expect(setSlideStatusMock).toHaveBeenNthCalledWith(1, 'Analyzing prompts');
    expect(setSlideStatusMock).toHaveBeenNthCalledWith(2, 'Generating feedback');
    expect(setSlideStatusMock).toHaveBeenLastCalledWith(null);
  });
});
