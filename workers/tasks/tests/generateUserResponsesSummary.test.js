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

import generateUserResponsesSummary from '../generateUserResponsesSummary.js';

beforeEach(() => {
  vi.clearAllMocks();
  agentRunMock.mockResolvedValue({ overview: 'ov' });
  createAgentMock.mockReturnValue({
    addSystemMessage: addSystemMessageMock,
    addUserMessage: addUserMessageMock,
    run: agentRunMock
  });
  connectDatabaseMock.mockResolvedValue({ models: {} });
});

describe('generateUserResponsesSummary', () => {
  it('throws when there are no prompt blocks in the scenario', async () => {
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({
      slidesByRef: { sl1: { ref: 'sl1', sortOrder: 0 } },
      blocksByRef: { b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'TEXT' } }
    });

    await expect(
      generateUserResponsesSummary({ scenarioId: 's1', userId: 'u1' })
    ).rejects.toThrow('No prompt blocks found in this scenario');
  });

  it('groups prompts by slide in slide-sortOrder and renders user responses (textValue + selectedOptions)', async () => {
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({
      slidesByRef: {
        sl2: { ref: 'sl2', name: 'Second slide', sortOrder: 1 },
        sl1: { ref: 'sl1', name: 'First slide', sortOrder: 0 }
      },
      blocksByRef: {
        b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'INPUT_PROMPT' },
        b2: { ref: 'b2', slideRef: 'sl2', sortOrder: 0, blockType: 'MULTIPLE_CHOICE_PROMPT' }
      }
    });

    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [
        { ref: 'b1', textValue: 'first answer' },
        { ref: 'b2', selectedOptions: ['Yes', 'No'] }
      ],
      stages: [{ slideRef: 'sl1', feedbackItems: ['nice work'] }]
    });

    await generateUserResponsesSummary({ scenarioId: 's1', userId: 'u1' });

    const userMessage = addUserMessageMock.mock.calls[0][0];

    // Slides appear in sortOrder
    const firstIndex = userMessage.indexOf('First slide');
    const secondIndex = userMessage.indexOf('Second slide');
    expect(firstIndex).toBeGreaterThan(0);
    expect(secondIndex).toBeGreaterThan(firstIndex);

    // Response values rendered
    expect(userMessage).toContain('first answer');
    expect(userMessage).toContain('Yes, No');

    // Feedback rendered for the slide that had it
    expect(userMessage).toContain('AI feedback given for this slide');
    expect(userMessage).toContain('nice work');
  });

  it('renders "No response provided" when the user has no response for a prompt block', async () => {
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({
      slidesByRef: { sl1: { ref: 'sl1', name: 'Intro', sortOrder: 0 } },
      blocksByRef: {
        b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'INPUT_PROMPT' }
      }
    });

    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [],
      stages: []
    });

    await generateUserResponsesSummary({ scenarioId: 's1', userId: 'u1' });

    const userMessage = addUserMessageMock.mock.calls[0][0];
    expect(userMessage).toContain('No response provided');
  });

  it('returns the agent response unchanged', async () => {
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({
      slidesByRef: { sl1: { ref: 'sl1', sortOrder: 0 } },
      blocksByRef: { b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'INPUT_PROMPT' } }
    });

    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [{ ref: 'b1', textValue: 'x' }],
      stages: []
    });

    const result = await generateUserResponsesSummary({ scenarioId: 's1', userId: 'u1' });
    expect(result).toEqual({ overview: 'ov' });
  });
});
