import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getSocketsMock,
  emitMock,
  generateMatchUserFeedbackToConditionsMock,
  generatedFeedbackFromFeedbackItemsMock,
  generateSlideResponsesSummaryMock,
  generateScenarioResponsesSummaryMock,
  generateUserResponsesSummaryMock
} = vi.hoisted(() => ({
  getSocketsMock: vi.fn(),
  emitMock: vi.fn(),
  generateMatchUserFeedbackToConditionsMock: vi.fn(),
  generatedFeedbackFromFeedbackItemsMock: vi.fn(),
  generateSlideResponsesSummaryMock: vi.fn(),
  generateScenarioResponsesSummaryMock: vi.fn(),
  generateUserResponsesSummaryMock: vi.fn()
}));

vi.mock('../../../backend/core/users/index.js', () => ({}));
vi.mock('../../../backend/modules/slides/index.js', () => ({}));
vi.mock('../../../backend/modules/blocks/index.js', () => ({}));
vi.mock('../../../backend/modules/runs/index.js', () => ({}));
vi.mock('../../../backend/modules/assets/index.js', () => ({}));

vi.mock('../../tasks/generateShowFeedbackFromPrompts.js', () => ({ default: vi.fn() }));
vi.mock('../../tasks/generateMatchUserFeedbackToConditions.js', () => ({
  default: (...args) => generateMatchUserFeedbackToConditionsMock(...args)
}));
vi.mock('../../tasks/generatedFeedbackFromFeedbackItems.js', () => ({
  default: (...args) => generatedFeedbackFromFeedbackItemsMock(...args)
}));
vi.mock('../../tasks/generateSlideResponsesSummary.js', () => ({
  default: (...args) => generateSlideResponsesSummaryMock(...args)
}));
vi.mock('../../tasks/generateScenarioResponsesSummary.js', () => ({
  default: (...args) => generateScenarioResponsesSummaryMock(...args)
}));
vi.mock('../../tasks/generateUserResponsesSummary.js', () => ({
  default: (...args) => generateUserResponsesSummaryMock(...args)
}));
vi.mock('../../getSockets.js', () => ({
  default: (...args) => getSocketsMock(...args)
}));

import generateRunner from '../generate.js';

beforeEach(() => {
  vi.clearAllMocks();
  getSocketsMock.mockResolvedValue({ emit: emitMock });
});

describe('generate runner', () => {
  it('USER_INPUT_PROMPT_MATCHES_CONDITION_PROMPT: emits GENERATING, dispatches the task, emits GENERATED with payload', async () => {
    generateMatchUserFeedbackToConditionsMock.mockResolvedValue({ conditions: [] });

    await generateRunner({
      id: 'j1',
      name: 'USER_INPUT_PROMPT_MATCHES_CONDITION_PROMPT',
      data: { payload: { stem: 'q', usersAnswer: 'a', conditions: [] } }
    });

    expect(generateMatchUserFeedbackToConditionsMock).toHaveBeenCalledWith({
      stem: 'q',
      usersAnswer: 'a',
      conditions: []
    });

    expect(emitMock).toHaveBeenNthCalledWith(1, 'workers:generate:j1', { event: 'GENERATING' });
    expect(emitMock).toHaveBeenNthCalledWith(2, 'workers:generate:j1', {
      event: 'GENERATED',
      payload: { conditions: [] }
    });
  });

  it('FEEDBACK_FROM_FEEDBACK_ITEMS: forwards feedbackItems + items and emits the GENERATED payload', async () => {
    generatedFeedbackFromFeedbackItemsMock.mockResolvedValue({ feedback: 'nice' });

    await generateRunner({
      id: 'j2',
      name: 'FEEDBACK_FROM_FEEDBACK_ITEMS',
      data: { payload: { feedbackItems: ['x'], items: [{ stem: 's', textValue: 't' }] } }
    });

    expect(generatedFeedbackFromFeedbackItemsMock).toHaveBeenCalledWith({
      feedbackItems: ['x'],
      items: [{ stem: 's', textValue: 't' }]
    });
    expect(emitMock).toHaveBeenNthCalledWith(2, 'workers:generate:j2', {
      event: 'GENERATED',
      payload: { feedback: 'nice' }
    });
  });

  it('SLIDE_RESPONSES_SUMMARY: passes the whole payload through and emits GENERATED', async () => {
    generateSlideResponsesSummaryMock.mockResolvedValue({ overview: 'ov' });

    const payload = { scenarioId: 's1', slideRef: 'sl1' };

    await generateRunner({
      id: 'j3',
      name: 'SLIDE_RESPONSES_SUMMARY',
      data: { payload }
    });

    expect(generateSlideResponsesSummaryMock).toHaveBeenCalledWith(payload);
    expect(emitMock).toHaveBeenNthCalledWith(2, 'workers:generate:j3', {
      event: 'GENERATED',
      payload: { overview: 'ov' }
    });
  });

  it('SCENARIO_RESPONSES_SUMMARY: passes the whole payload through and emits GENERATED', async () => {
    generateScenarioResponsesSummaryMock.mockResolvedValue({ overview: 'ov' });

    await generateRunner({
      id: 'j4',
      name: 'SCENARIO_RESPONSES_SUMMARY',
      data: { payload: { scenarioId: 's1' } }
    });

    expect(generateScenarioResponsesSummaryMock).toHaveBeenCalledWith({ scenarioId: 's1' });
    expect(emitMock).toHaveBeenNthCalledWith(2, 'workers:generate:j4', {
      event: 'GENERATED',
      payload: { overview: 'ov' }
    });
  });

  it('USER_RESPONSES_SUMMARY: passes the whole payload through and emits GENERATED', async () => {
    generateUserResponsesSummaryMock.mockResolvedValue({ overview: 'ov' });

    await generateRunner({
      id: 'j5',
      name: 'USER_RESPONSES_SUMMARY',
      data: { payload: { scenarioId: 's1', userId: 'u1' } }
    });

    expect(generateUserResponsesSummaryMock).toHaveBeenCalledWith({ scenarioId: 's1', userId: 'u1' });
    expect(emitMock).toHaveBeenNthCalledWith(2, 'workers:generate:j5', {
      event: 'GENERATED',
      payload: { overview: 'ov' }
    });
  });

  it('SHOW_FEEDBACK_FROM_PROMPTS is a no-op (the task call is commented out)', async () => {
    await generateRunner({
      id: 'j6',
      name: 'SHOW_FEEDBACK_FROM_PROMPTS',
      data: { payload: {} }
    });

    expect(emitMock).not.toHaveBeenCalled();
    expect(generateMatchUserFeedbackToConditionsMock).not.toHaveBeenCalled();
  });

  it('does nothing for unknown job names', async () => {
    await generateRunner({ id: 'j7', name: 'UNKNOWN', data: {} });
    expect(emitMock).not.toHaveBeenCalled();
  });

  it('re-throws when a task fails', async () => {
    generateScenarioResponsesSummaryMock.mockRejectedValue(new Error('boom'));

    await expect(
      generateRunner({
        id: 'j8',
        name: 'SCENARIO_RESPONSES_SUMMARY',
        data: { payload: {} }
      })
    ).rejects.toThrow();
  });
});
