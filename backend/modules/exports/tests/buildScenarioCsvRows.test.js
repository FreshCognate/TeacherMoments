import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getScenarioSlidesAndBlocksByRefMock, buildUserScenarioResponseMock, getUserDisplayNameMock, formatTimeSpentMock } = vi.hoisted(() => ({
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn(),
  getUserDisplayNameMock: vi.fn(),
  formatTimeSpentMock: vi.fn()
}));

vi.mock('../../responses/helpers/getScenarioSlidesAndBlocksByRef.js', () => ({
  default: (...args) => getScenarioSlidesAndBlocksByRefMock(...args)
}));

vi.mock('../../responses/helpers/buildUserScenarioResponse.js', () => ({
  default: (...args) => buildUserScenarioResponseMock(...args)
}));

vi.mock('#core/users/helpers/getUserDisplayName.js', () => ({
  default: (...args) => getUserDisplayNameMock(...args)
}));

vi.mock('../../scenarios/helpers/formatTimeSpent.js', () => ({
  default: (...args) => formatTimeSpentMock(...args)
}));

import buildScenarioCsvRows from '../helpers/buildScenarioCsvRows.js';

describe('buildScenarioCsvRows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });
    getUserDisplayNameMock.mockImplementation((u) => u.username);
    formatTimeSpentMock.mockImplementation((ms) => `${ms}ms`);
  });

  it('returns an empty array when there are no users', async () => {
    const result = await buildScenarioCsvRows({ scenarioId: 's1', users: [], models: {} });
    expect(result).toEqual([]);
  });

  it('builds a header row using slide name + block name and appends "Total Time"', async () => {
    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [
        { slideRef: 'slide-1', slideName: 'Intro', name: 'Question 1', sortOrder: 0, blockType: 'INPUT_PROMPT', inputType: 'TEXT', textValue: 'Hi' }
      ],
      stages: [],
      totalTimeSpentMs: 1000
    });

    const rows = await buildScenarioCsvRows({
      scenarioId: 's1',
      users: [{ _id: 'u1', username: 'sam' }],
      models: {}
    });

    expect(rows[0]).toEqual(['Username', 'Row Type', 'Intro - Question 1', 'Total Time']);
  });

  it('falls back to ref or "Block N+1" when block name is missing', async () => {
    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [
        { slideRef: 's1', slideName: 'Intro', ref: 'block-ref-1', sortOrder: 0, blockType: 'INPUT_PROMPT', inputType: 'TEXT' },
        { slideRef: 's1', slideName: 'Intro', sortOrder: 1, blockType: 'INPUT_PROMPT', inputType: 'TEXT' }
      ],
      stages: [],
      totalTimeSpentMs: 0
    });

    const rows = await buildScenarioCsvRows({
      scenarioId: 's1',
      users: [{ _id: 'u1', username: 'sam' }],
      models: {}
    });

    expect(rows[0]).toEqual(['Username', 'Row Type', 'Intro - block-ref-1', 'Intro - Block 2', 'Total Time']);
  });

  it('outputs Value, Feedback, and Time rows per user with three rows per user', async () => {
    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [
        { slideRef: 'slide-1', slideName: 'Intro', name: 'B1', sortOrder: 0, blockType: 'INPUT_PROMPT', inputType: 'TEXT', textValue: 'Answer' }
      ],
      stages: [{ slideRef: 'slide-1', feedbackItems: ['Nice'], timeSpentMs: 5000 }],
      totalTimeSpentMs: 5000
    });

    const rows = await buildScenarioCsvRows({
      scenarioId: 's1',
      users: [{ _id: 'u1', username: 'sam' }],
      models: {}
    });

    expect(rows).toHaveLength(4);
    expect(rows[1]).toEqual(['sam', 'Value', 'Answer', '5000ms']);
    expect(rows[2]).toEqual(['', 'Feedback', 'Nice', '']);
    expect(rows[3]).toEqual(['', 'Time', '5000ms', '']);
  });

  it('formats MULTIPLE_CHOICE_PROMPT values as comma-separated options', async () => {
    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [
        { slideRef: 's1', slideName: 'Intro', name: 'B1', sortOrder: 0, blockType: 'MULTIPLE_CHOICE_PROMPT', selectedOptions: ['Yes', 'Maybe'] }
      ],
      stages: [],
      totalTimeSpentMs: 0
    });

    const rows = await buildScenarioCsvRows({
      scenarioId: 's1',
      users: [{ _id: 'u1', username: 'sam' }],
      models: {}
    });

    expect(rows[1]).toEqual(['sam', 'Value', 'Yes, Maybe', '0ms']);
  });

  it('uses the audio transcript for INPUT_PROMPT blocks of audio type', async () => {
    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [
        { slideRef: 's1', slideName: 'Intro', name: 'B1', sortOrder: 0, blockType: 'INPUT_PROMPT', inputType: 'AUDIO', audio: { transcript: 'transcribed text' } }
      ],
      stages: [],
      totalTimeSpentMs: 0
    });

    const rows = await buildScenarioCsvRows({
      scenarioId: 's1',
      users: [{ _id: 'u1', username: 'sam' }],
      models: {}
    });

    expect(rows[1][2]).toBe('transcribed text');
  });

  it('only emits feedback/time on the first block of each slide', async () => {
    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [
        { slideRef: 'slide-1', slideName: 'Intro', name: 'B1', sortOrder: 0, blockType: 'INPUT_PROMPT', inputType: 'TEXT' },
        { slideRef: 'slide-1', slideName: 'Intro', name: 'B2', sortOrder: 1, blockType: 'INPUT_PROMPT', inputType: 'TEXT' },
        { slideRef: 'slide-2', slideName: 'Next', name: 'B3', sortOrder: 0, blockType: 'INPUT_PROMPT', inputType: 'TEXT' }
      ],
      stages: [
        { slideRef: 'slide-1', feedbackItems: ['Slide 1 feedback'], timeSpentMs: 1000 },
        { slideRef: 'slide-2', feedbackItems: ['Slide 2 feedback'], timeSpentMs: 2000 }
      ],
      totalTimeSpentMs: 3000
    });

    const rows = await buildScenarioCsvRows({
      scenarioId: 's1',
      users: [{ _id: 'u1', username: 'sam' }],
      models: {}
    });

    expect(rows[2]).toEqual(['', 'Feedback', 'Slide 1 feedback', '', 'Slide 2 feedback', '']);
    expect(rows[3]).toEqual(['', 'Time', '1000ms', '', '2000ms', '']);
  });

  it('reuses the header across multiple users', async () => {
    buildUserScenarioResponseMock
      .mockResolvedValueOnce({
        blockResponses: [
          { slideRef: 'slide-1', slideName: 'Intro', name: 'B1', sortOrder: 0, blockType: 'INPUT_PROMPT', inputType: 'TEXT' }
        ],
        stages: [],
        totalTimeSpentMs: 0
      })
      .mockResolvedValueOnce({
        blockResponses: [
          { slideRef: 'slide-1', slideName: 'Intro', name: 'B1', sortOrder: 0, blockType: 'INPUT_PROMPT', inputType: 'TEXT' }
        ],
        stages: [],
        totalTimeSpentMs: 0
      });

    const rows = await buildScenarioCsvRows({
      scenarioId: 's1',
      users: [{ _id: 'u1', username: 'a' }, { _id: 'u2', username: 'b' }],
      models: {}
    });

    expect(rows.filter((r) => r[0] === 'Username')).toHaveLength(1);
    expect(rows).toHaveLength(7);
  });
});
