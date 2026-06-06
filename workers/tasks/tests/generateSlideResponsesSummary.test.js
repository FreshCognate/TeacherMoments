import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../tests/with-mongo.js';

const {
  connectDatabaseMock,
  getScenarioSlidesAndBlocksByRefMock,
  buildUserScenarioResponseMock,
  agentRunMock,
  createAgentMock
} = vi.hoisted(() => ({
  connectDatabaseMock: vi.fn(),
  getScenarioSlidesAndBlocksByRefMock: vi.fn(),
  buildUserScenarioResponseMock: vi.fn(),
  agentRunMock: vi.fn(),
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

const db = setupMongo();

const cohortId = new mongoose.Types.ObjectId();

describe('generateSlideResponsesSummary (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({ models: db.models });
    agentRunMock.mockResolvedValue({ overview: 'ov', sections: [], summary: 'sm' });
    createAgentMock.mockReturnValue({
      addSystemMessage: vi.fn(),
      addUserMessage: vi.fn(),
      run: agentRunMock
    });
  });

  it('throws when the slide is not present in slidesByRef', async () => {
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({ slidesByRef: {}, blocksByRef: {} });

    await expect(
      generateSlideResponsesSummary({ scenarioId: 's1', slideRef: 'sl1', cohortId })
    ).rejects.toThrow('Slide not found');
  });

  it('throws when the slide has no prompt blocks', async () => {
    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({
      slidesByRef: { sl1: { ref: 'sl1', name: 'Intro', sortOrder: 0 } },
      blocksByRef: { b1: { ref: 'b1', slideRef: 'sl1', sortOrder: 0, blockType: 'TEXT' } }
    });

    await expect(
      generateSlideResponsesSummary({ scenarioId: 's1', slideRef: 'sl1', cohortId })
    ).rejects.toThrow('No prompt blocks found on this slide');
  });

  it('returns the agent response merged with the slide and its blocks', async () => {
    const slide = { ref: 'sl1', name: 'Intro', sortOrder: 0 };
    const promptBlock = { ref: 'b1', slideRef: 'sl1', sortOrder: 1, blockType: 'INPUT_PROMPT' };
    const textBlock = { ref: 'b0', slideRef: 'sl1', sortOrder: 0, blockType: 'TEXT' };
    const otherSlideBlock = { ref: 'bx', slideRef: 'OTHER', sortOrder: 0, blockType: 'INPUT_PROMPT' };

    getScenarioSlidesAndBlocksByRefMock.mockResolvedValue({
      slidesByRef: { sl1: slide, OTHER: { ref: 'OTHER' } },
      blocksByRef: { b0: textBlock, b1: promptBlock, bx: otherSlideBlock }
    });

    // Two cohort members so the >= 2 responses guard is satisfied.
    await db.models.User.create({ email: 'u1@x.com', cohorts: [{ cohort: cohortId }] });
    await db.models.User.create({ email: 'u2@x.com', cohorts: [{ cohort: cohortId }] });

    buildUserScenarioResponseMock.mockResolvedValue({
      blockResponses: [{ ref: 'b1', textValue: 'an answer' }],
      stages: []
    });

    const result = await generateSlideResponsesSummary({ scenarioId: 's1', slideRef: 'sl1', cohortId });

    expect(result).toEqual({
      overview: 'ov',
      sections: [],
      summary: 'sm',
      slide,
      blocks: [textBlock, promptBlock]
    });
  });
});
