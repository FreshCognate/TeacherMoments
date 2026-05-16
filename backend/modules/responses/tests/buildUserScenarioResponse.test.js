import { describe, it, expect, vi, beforeEach } from 'vitest';

const { populateRunMock } = vi.hoisted(() => ({ populateRunMock: vi.fn() }));

vi.mock('../../runs/helpers/populateRun.js', () => ({
  default: (...args) => populateRunMock(...args)
}));

import buildUserScenarioResponse from '../helpers/buildUserScenarioResponse.js';

const buildModels = ({ previousRuns = [], currentRun = null }) => ({
  Run: {
    find: vi.fn(() => ({ sort: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(previousRuns) })) })),
    findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(currentRun) }))
  }
});

const baseBlocksByRef = (overrides = {}) => ({
  'block-a': {
    ref: 'block-a',
    slideRef: 'slide-1',
    name: 'Block A',
    sortOrder: 0,
    blockType: 'TEXT'
  },
  ...overrides
});

const baseSlidesByRef = (overrides = {}) => ({
  'slide-1': { ref: 'slide-1', name: 'Slide 1', sortOrder: 0 },
  ...overrides
});

describe('buildUserScenarioResponse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns hasStarted=false when there is no current run', async () => {
    const models = buildModels({ previousRuns: [], currentRun: null });

    const result = await buildUserScenarioResponse(
      { userId: 'u1', scenarioId: 's1', slidesByRef: baseSlidesByRef(), blocksByRef: baseBlocksByRef() },
      { models }
    );

    expect(result.hasStarted).toBe(false);
    expect(result.isComplete).toBe(false);
    expect(result.totalTimeSpentMs).toBe(0);
    expect(result.stages).toEqual([]);
  });

  it('marks hasBeenCompleted true when any previous archived run was complete', async () => {
    const models = buildModels({
      previousRuns: [{ _id: 'r-old', isComplete: true }],
      currentRun: null
    });

    const result = await buildUserScenarioResponse(
      { userId: 'u1', scenarioId: 's1', slidesByRef: baseSlidesByRef(), blocksByRef: baseBlocksByRef() },
      { models }
    );

    expect(result.hasBeenCompleted).toBe(true);
    expect(result.previousRunsCount).toBe(1);
  });

  it('uses the populated current run for stages, totalTimeSpentMs, isComplete', async () => {
    const models = buildModels({
      previousRuns: [],
      currentRun: { _id: 'r1', isComplete: true, totalTimeSpentMs: 5000 }
    });

    populateRunMock.mockResolvedValue({
      isComplete: true,
      totalTimeSpentMs: 5000,
      stages: [
        { slideRef: 'slide-1', timeSpentMs: 2000, feedbackItems: ['Good'], blocksByRef: {} }
      ]
    });

    const result = await buildUserScenarioResponse(
      { userId: 'u1', scenarioId: 's1', slidesByRef: baseSlidesByRef(), blocksByRef: baseBlocksByRef() },
      { models }
    );

    expect(result.hasStarted).toBe(true);
    expect(result.isComplete).toBe(true);
    expect(result.totalTimeSpentMs).toBe(5000);
    expect(result.stages).toEqual([
      { slideRef: 'slide-1', timeSpentMs: 2000, feedbackItems: ['Good'] }
    ]);
  });

  it('attaches block tracking from stages.blocksByRef onto the matching block response', async () => {
    const models = buildModels({
      previousRuns: [],
      currentRun: { _id: 'r1' }
    });

    populateRunMock.mockResolvedValue({
      isComplete: false,
      totalTimeSpentMs: 0,
      stages: [{
        slideRef: 'slide-1',
        timeSpentMs: 0,
        feedbackItems: [],
        blocksByRef: {
          'block-a': { selectedOptions: ['x'], textValue: 'hi', audio: { transcript: 't' } }
        }
      }]
    });

    const result = await buildUserScenarioResponse(
      { userId: 'u1', scenarioId: 's1', slidesByRef: baseSlidesByRef(), blocksByRef: baseBlocksByRef() },
      { models }
    );

    const blockA = result.blockResponses.find((b) => b.ref === 'block-a');
    expect(blockA).toMatchObject({
      selectedOptions: ['x'],
      textValue: 'hi',
      audio: { transcript: 't' }
    });
  });

  it('sorts blockResponses by slideSortOrder then sortOrder', async () => {
    const models = buildModels({ previousRuns: [], currentRun: null });

    const blocksByRef = {
      'block-z': { ref: 'block-z', slideRef: 'slide-2', name: 'Z', sortOrder: 0, blockType: 'TEXT' },
      'block-a': { ref: 'block-a', slideRef: 'slide-1', name: 'A', sortOrder: 1, blockType: 'TEXT' },
      'block-b': { ref: 'block-b', slideRef: 'slide-1', name: 'B', sortOrder: 0, blockType: 'TEXT' }
    };
    const slidesByRef = {
      'slide-1': { ref: 'slide-1', name: 'S1', sortOrder: 0 },
      'slide-2': { ref: 'slide-2', name: 'S2', sortOrder: 1 }
    };

    const result = await buildUserScenarioResponse(
      { userId: 'u1', scenarioId: 's1', slidesByRef, blocksByRef },
      { models }
    );

    expect(result.blockResponses.map((b) => b.ref)).toEqual(['block-b', 'block-a', 'block-z']);
  });

  it('uses slideSortOrder=0 fallback when the slide is missing from slidesByRef', async () => {
    const models = buildModels({ previousRuns: [], currentRun: null });

    const blocksByRef = {
      'block-orphan': { ref: 'block-orphan', slideRef: 'missing-slide', name: 'O', sortOrder: 5, blockType: 'TEXT' }
    };

    const result = await buildUserScenarioResponse(
      { userId: 'u1', scenarioId: 's1', slidesByRef: {}, blocksByRef },
      { models }
    );

    expect(result.blockResponses[0].slideSortOrder).toBe(0);
    expect(result.blockResponses[0].slideName).toBeUndefined();
  });
});
