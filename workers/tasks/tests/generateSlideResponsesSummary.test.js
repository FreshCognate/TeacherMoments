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

import generateSlideResponsesSummary from '../generateSlideResponsesSummary.js';

beforeEach(() => {
  vi.clearAllMocks();
  agentRunMock.mockResolvedValue({ overview: 'ov', sections: [], summary: 'sm' });
  createAgentMock.mockReturnValue({
    addSystemMessage: addSystemMessageMock,
    addUserMessage: addUserMessageMock,
    run: agentRunMock
  });
});

const setupDb = ({ slidesByRef = {}, blocksByRef = {}, cohortUsers = [] } = {}) => {
  const userFind = vi.fn(() => ({ lean: vi.fn().mockResolvedValue(cohortUsers) }));

  connectDatabaseMock.mockResolvedValue({
    models: { Run: { find: vi.fn() }, User: { find: userFind } }
  });
  getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef, blocksByRef });

  return { userFind };
};

describe('generateSlideResponsesSummary', () => {
  it('throws when the slide is not present in slidesByRef', async () => {
    setupDb({
      slidesByRef: {},
      blocksByRef: {}
    });

    await expect(
      generateSlideResponsesSummary({ scenarioId: 's1', slideRef: 'sl1', cohortId: 'c1' })
    ).rejects.toThrow('Slide not found');
  });

  it('throws when the slide has no prompt blocks', async () => {
    setupDb({
      slidesByRef: { sl1: { ref: 'sl1', name: 'Intro', sortOrder: 0 } },
      blocksByRef: {
        b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'TEXT' }
      }
    });

    await expect(
      generateSlideResponsesSummary({ scenarioId: 's1', slideRef: 'sl1', cohortId: 'c1' })
    ).rejects.toThrow('No prompt blocks found on this slide');
  });

  it('returns the agent response merged with slide and blocks for the slide', async () => {
    const slide = { ref: 'sl1', name: 'Intro', sortOrder: 0 };
    const promptBlock = { ref: 'b1', slideRef: 'sl1', sortOrder: 1, blockType: 'INPUT_PROMPT' };
    const textBlock = { ref: 'b0', slideRef: 'sl1', sortOrder: 0, blockType: 'TEXT' };
    const otherSlideBlock = { ref: 'bx', slideRef: 'OTHER', sortOrder: 0, blockType: 'INPUT_PROMPT' };

    setupDb({
      slidesByRef: { sl1: slide, OTHER: { ref: 'OTHER' } },
      blocksByRef: { b0: textBlock, b1: promptBlock, bx: otherSlideBlock },
      cohortUsers: [{ _id: 'u1' }, { _id: 'u2' }]
    });

    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [{ ref: 'b1', textValue: 'an answer' }],
      stages: []
    });

    const result = await generateSlideResponsesSummary({ scenarioId: 's1', slideRef: 'sl1', cohortId: 'c1' });

    expect(result).toEqual({
      overview: 'ov',
      sections: [],
      summary: 'sm',
      slide,
      blocks: [textBlock, promptBlock] // sorted by sortOrder, scoped to this slide
    });
  });
});
