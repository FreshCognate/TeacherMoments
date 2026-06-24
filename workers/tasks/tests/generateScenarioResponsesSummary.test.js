import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  connectDatabaseMock,
  getScenarioSlidesAndBlocksByRefMock,
  buildUserScenarioResponseMock,
  agentRunMock,
  addSystemMessageMock,
  addUserMessageMock,
  createAgentMock
} = vi.hoisted(() => ({
  connectDatabaseMock: vi.fn(),
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn(),
  agentRunMock: vi.fn(),
  addSystemMessageMock: vi.fn(),
  addUserMessageMock: vi.fn(),
  createAgentMock: vi.fn()
}));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));
vi.mock('../../../backend/modules/responses/helpers/getScenarioSlidesAndBlocksByRef.js', () => ({
  default: (...args) => getScenarioSlidesAndBlocksByRefMock(...args)
}));
vi.mock('../../../backend/modules/responses/helpers/buildUserScenarioResponse.js', () => ({
  default: (...args) => buildUserScenarioResponseMock(...args)
}));
vi.mock('../../agents/helpers/createAgent.js', () => ({
  default: (...args) => createAgentMock(...args)
}));

import generateScenarioResponsesSummary from '../generateScenarioResponsesSummary.js';

beforeEach(() => {
  vi.clearAllMocks();
  agentRunMock.mockResolvedValue({ overview: 'ov', sections: [], summary: 'sm' });
  createAgentMock.mockReturnValue({
    addSystemMessage: addSystemMessageMock,
    addUserMessage: addUserMessageMock,
    run: agentRunMock
  });
});

const setupDb = ({ slidesByRef = {}, blocksByRef = {}, runs = [], cohortUsers = [] } = {}) => {
  const runFind = vi.fn(() => ({ lean: vi.fn().mockResolvedValue(runs) }));
  const userFind = vi.fn(() => ({ lean: vi.fn().mockResolvedValue(cohortUsers) }));

  connectDatabaseMock.mockResolvedValue({
    models: { Run: { find: runFind }, User: { find: userFind } },
    close: vi.fn()
  });
  getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef, blocksByRef });

  return { runFind, userFind };
};

describe('generateScenarioResponsesSummary', () => {
  it('throws when there are no prompt blocks in the scenario', async () => {
    setupDb({
      slidesByRef: { sl1: { ref: 'sl1', sortOrder: 0 } },
      blocksByRef: { b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'TEXT' } }
    });

    await expect(
      generateScenarioResponsesSummary({ scenarioId: 's1' })
    ).rejects.toThrow('No prompt blocks found in this scenario');
  });

  it('throws when fewer than 2 responses were collected across all prompts', async () => {
    setupDb({
      slidesByRef: { sl1: { ref: 'sl1', sortOrder: 0 } },
      blocksByRef: { b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'INPUT_PROMPT' } },
      runs: [{ user: 'u1' }]
    });

    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [{ ref: 'b1', textValue: 'one' }],
      stages: []
    });

    await expect(
      generateScenarioResponsesSummary({ scenarioId: 's1' })
    ).rejects.toThrow('Not enough responses to generate a summary');
  });

  it('uses cohort users when cohortId is supplied (ignoring runs)', async () => {
    const { userFind, runFind } = setupDb({
      slidesByRef: { sl1: { ref: 'sl1', sortOrder: 0 } },
      blocksByRef: { b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'INPUT_PROMPT' } },
      cohortUsers: [{ _id: 'u1' }, { _id: 'u2' }]
    });

    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [{ ref: 'b1', textValue: 'response' }],
      stages: []
    });

    await generateScenarioResponsesSummary({ scenarioId: 's1', cohortId: 'c1' });

    expect(userFind).toHaveBeenCalledWith({ 'cohorts.cohort': 'c1' });
    expect(runFind).not.toHaveBeenCalled();
    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
  });

  it('uses de-duplicated run users when no cohortId is supplied', async () => {
    const { runFind, userFind } = setupDb({
      slidesByRef: { sl1: { ref: 'sl1', sortOrder: 0 } },
      blocksByRef: { b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'INPUT_PROMPT' } },
      runs: [{ user: 'u1' }, { user: 'u2' }, { user: 'u1' }]
    });

    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [{ ref: 'b1', textValue: 'response' }],
      stages: []
    });

    await generateScenarioResponsesSummary({ scenarioId: 's1' });

    expect(runFind).toHaveBeenCalledWith({ scenario: 's1', isDeleted: false });
    expect(userFind).not.toHaveBeenCalled();
    // u1 deduped — buildUserScenarioResponse called for u1 and u2 only
    expect(buildUserScenarioResponseMock).toHaveBeenCalledTimes(2);
  });

  it('renders textValue as-is and joins selectedOptions with commas', async () => {
    setupDb({
      slidesByRef: { sl1: { ref: 'sl1', sortOrder: 0 } },
      blocksByRef: {
        b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'INPUT_PROMPT', 'en-US-body': [] },
        b2: { ref: 'b2', slideRef: 'sl1', sortOrder: 1, blockType: 'MULTIPLE_CHOICE_PROMPT', 'en-US-body': [] }
      },
      cohortUsers: [{ _id: 'u1' }, { _id: 'u2' }]
    });

    buildUserScenarioResponseMock
      .mockResolvedValueOnce({
        blockResponses: [
          { ref: 'b1', textValue: 'free text answer' },
          { ref: 'b2', selectedOptions: ['Yes', 'Maybe'] }
        ],
        stages: []
      })
      .mockResolvedValueOnce({
        blockResponses: [{ ref: 'b1', textValue: 'second' }],
        stages: []
      });

    await generateScenarioResponsesSummary({ scenarioId: 's1', cohortId: 'c1' });

    const userMessage = addUserMessageMock.mock.calls[0][0];
    expect(userMessage).toContain('free text answer');
    expect(userMessage).toContain('Yes, Maybe');
    expect(userMessage).toContain('second');
    // block type labels
    expect(userMessage).toContain('Text input');
    expect(userMessage).toContain('Multiple choice');
  });

  it('returns the agent response unchanged', async () => {
    setupDb({
      slidesByRef: { sl1: { ref: 'sl1', sortOrder: 0 } },
      blocksByRef: { b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'INPUT_PROMPT' } },
      cohortUsers: [{ _id: 'u1' }, { _id: 'u2' }]
    });

    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [{ ref: 'b1', textValue: 'response' }],
      stages: []
    });

    const result = await generateScenarioResponsesSummary({ scenarioId: 's1', cohortId: 'c1' });
    expect(result).toEqual({ overview: 'ov', sections: [], summary: 'sm' });
  });
});
