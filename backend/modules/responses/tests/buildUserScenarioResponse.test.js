import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { populateRunMock } = vi.hoisted(() => ({ populateRunMock: vi.fn() }));

vi.mock('../../runs/helpers/populateRun.js', () => ({
  default: (...args) => populateRunMock(...args)
}));

import buildUserScenarioResponse from '../helpers/buildUserScenarioResponse.js';

const db = setupMongo();

const baseBlocksByRef = (overrides = {}) => ({
  'block-a': { ref: 'block-a', slideRef: 'slide-1', name: 'Block A', sortOrder: 0, blockType: 'TEXT' },
  ...overrides
});
const baseSlidesByRef = (overrides = {}) => ({
  'slide-1': { ref: 'slide-1', name: 'Slide 1', sortOrder: 0 },
  ...overrides
});

describe('buildUserScenarioResponse (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns hasStarted=false when there is no current run', async () => {
    const result = await buildUserScenarioResponse(
      { userId: new mongoose.Types.ObjectId(), scenarioId: new mongoose.Types.ObjectId(), slidesByRef: baseSlidesByRef(), blocksByRef: baseBlocksByRef() },
      { models: db.models }
    );

    expect(result.hasStarted).toBe(false);
    expect(result.isComplete).toBe(false);
    expect(result.totalTimeSpentMs).toBe(0);
    expect(result.stages).toEqual([]);
  });

  it('marks hasBeenCompleted true when a previous archived run was complete', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenarioId = new mongoose.Types.ObjectId();
    await db.models.Run.create({ scenario: scenarioId, user: userId, isArchived: true, isComplete: true });

    const result = await buildUserScenarioResponse(
      { userId, scenarioId, slidesByRef: baseSlidesByRef(), blocksByRef: baseBlocksByRef() },
      { models: db.models }
    );

    expect(result.hasBeenCompleted).toBe(true);
    expect(result.previousRunsCount).toBe(1);
  });

  it('uses the populated current run for stages, totalTimeSpentMs, isComplete', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenarioId = new mongoose.Types.ObjectId();
    await db.models.Run.create({ scenario: scenarioId, user: userId, isArchived: false });

    populateRunMock.mockResolvedValue({
      isComplete: true,
      totalTimeSpentMs: 5000,
      stages: [{ slideRef: 'slide-1', timeSpentMs: 2000, feedbackItems: ['Good'], blocksByRef: {} }]
    });

    const result = await buildUserScenarioResponse(
      { userId, scenarioId, slidesByRef: baseSlidesByRef(), blocksByRef: baseBlocksByRef() },
      { models: db.models }
    );

    expect(result.hasStarted).toBe(true);
    expect(result.isComplete).toBe(true);
    expect(result.totalTimeSpentMs).toBe(5000);
    expect(result.stages).toEqual([{ slideRef: 'slide-1', timeSpentMs: 2000, feedbackItems: ['Good'] }]);
  });

  it('attaches block tracking from stages.blocksByRef onto the matching block response', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenarioId = new mongoose.Types.ObjectId();
    await db.models.Run.create({ scenario: scenarioId, user: userId, isArchived: false });

    populateRunMock.mockResolvedValue({
      isComplete: false,
      totalTimeSpentMs: 0,
      stages: [{
        slideRef: 'slide-1',
        timeSpentMs: 0,
        feedbackItems: [],
        blocksByRef: { 'block-a': { selectedOptions: ['x'], textValue: 'hi', audio: { transcript: 't' } } }
      }]
    });

    const result = await buildUserScenarioResponse(
      { userId, scenarioId, slidesByRef: baseSlidesByRef(), blocksByRef: baseBlocksByRef() },
      { models: db.models }
    );

    const blockA = result.blockResponses.find((b) => b.ref === 'block-a');
    expect(blockA).toMatchObject({ selectedOptions: ['x'], textValue: 'hi', audio: { transcript: 't' } });
  });

  it('resolves selected option _ids to their value (falling back to text)', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenarioId = new mongoose.Types.ObjectId();
    await db.models.Run.create({ scenario: scenarioId, user: userId, isArchived: false });

    const withValueId = new mongoose.Types.ObjectId();
    const withoutValueId = new mongoose.Types.ObjectId();

    const blocksByRef = baseBlocksByRef({
      'block-a': {
        ref: 'block-a',
        slideRef: 'slide-1',
        name: 'Block A',
        sortOrder: 0,
        blockType: 'MULTIPLE_CHOICE_PROMPT',
        options: [
          { _id: withValueId, value: 'Agree', 'en-US-text': 'I agree' },
          { _id: withoutValueId, value: '', 'en-US-text': 'No value option' }
        ]
      }
    });

    populateRunMock.mockResolvedValue({
      isComplete: false,
      totalTimeSpentMs: 0,
      stages: [{
        slideRef: 'slide-1',
        timeSpentMs: 0,
        feedbackItems: [],
        blocksByRef: { 'block-a': { selectedOptions: [String(withValueId), String(withoutValueId)] } }
      }]
    });

    const result = await buildUserScenarioResponse(
      { userId, scenarioId, slidesByRef: baseSlidesByRef(), blocksByRef },
      { models: db.models }
    );

    const blockA = result.blockResponses.find((b) => b.ref === 'block-a');
    expect(blockA.selectedOptions).toEqual([String(withValueId), String(withoutValueId)]);
    expect(blockA.selectedOptionLabels).toEqual(['Agree', 'No value option']);
  });

  it('resolves legacy value-based selections and leaves unknown entries unchanged', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenarioId = new mongoose.Types.ObjectId();
    await db.models.Run.create({ scenario: scenarioId, user: userId, isArchived: false });

    const blocksByRef = baseBlocksByRef({
      'block-a': {
        ref: 'block-a',
        slideRef: 'slide-1',
        name: 'Block A',
        sortOrder: 0,
        blockType: 'MULTIPLE_CHOICE_PROMPT',
        options: [{ _id: new mongoose.Types.ObjectId(), value: 'Agree', 'en-US-text': 'I agree' }]
      }
    });

    populateRunMock.mockResolvedValue({
      isComplete: false,
      totalTimeSpentMs: 0,
      stages: [{
        slideRef: 'slide-1',
        timeSpentMs: 0,
        feedbackItems: [],
        blocksByRef: { 'block-a': { selectedOptions: ['Agree', 'DELETED'] } }
      }]
    });

    const result = await buildUserScenarioResponse(
      { userId, scenarioId, slidesByRef: baseSlidesByRef(), blocksByRef },
      { models: db.models }
    );

    const blockA = result.blockResponses.find((b) => b.ref === 'block-a');
    expect(blockA.selectedOptions).toEqual(['Agree', 'DELETED']);
    expect(blockA.selectedOptionLabels).toEqual(['Agree', 'DELETED']);
  });

  it('sorts blockResponses by authoring slide order then block sortOrder', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const createdRoot = await db.models.Stem.create({ scenario: scenarioId, isRoot: true });
    const root = await db.models.Stem.findById(createdRoot._id).lean();

    const blocksByRef = {
      'block-z': { ref: 'block-z', slideRef: 'slide-2', name: 'Z', sortOrder: 0, blockType: 'TEXT' },
      'block-a': { ref: 'block-a', slideRef: 'slide-1', name: 'A', sortOrder: 1, blockType: 'TEXT' },
      'block-b': { ref: 'block-b', slideRef: 'slide-1', name: 'B', sortOrder: 0, blockType: 'TEXT' }
    };
    const slidesByRef = {
      'slide-1': { ref: 'slide-1', name: 'S1', stemRef: root.ref, sortOrder: 0 },
      'slide-2': { ref: 'slide-2', name: 'S2', stemRef: root.ref, sortOrder: 1 }
    };

    const result = await buildUserScenarioResponse(
      { userId: new mongoose.Types.ObjectId(), scenarioId, slidesByRef, blocksByRef },
      { models: db.models }
    );

    expect(result.blockResponses.map((b) => b.ref)).toEqual(['block-b', 'block-a', 'block-z']);
  });

  it('orders blockResponses by authoring stem traversal across branches', async () => {
    const scenarioId = new mongoose.Types.ObjectId();

    const createdRoot = await db.models.Stem.create({ scenario: scenarioId, isRoot: true });
    const s2Ref = new mongoose.Types.ObjectId();
    const createdStem1 = await db.models.Stem.create({ scenario: scenarioId, slideRef: s2Ref, sortOrder: 0 });
    const createdStem2 = await db.models.Stem.create({ scenario: scenarioId, slideRef: s2Ref, sortOrder: 1 });

    const root = await db.models.Stem.findById(createdRoot._id).lean();
    const branch1 = await db.models.Stem.findById(createdStem1._id).lean();
    const branch2 = await db.models.Stem.findById(createdStem2._id).lean();

    const s1Ref = new mongoose.Types.ObjectId();
    const s3Ref = new mongoose.Types.ObjectId();
    const s1aRef = new mongoose.Types.ObjectId();
    const s1bRef = new mongoose.Types.ObjectId();
    const s2aRef = new mongoose.Types.ObjectId();
    const s2bRef = new mongoose.Types.ObjectId();

    const slidesByRef = {
      [String(s1Ref)]: { ref: s1Ref, name: 'Slide 1', stemRef: root.ref, sortOrder: 0 },
      [String(s2Ref)]: { ref: s2Ref, name: 'Slide 2', stemRef: root.ref, sortOrder: 1 },
      [String(s3Ref)]: { ref: s3Ref, name: 'Slide 3', stemRef: root.ref, sortOrder: 2 },
      [String(s1aRef)]: { ref: s1aRef, name: 'Stem1 Slide 1', stemRef: branch1.ref, sortOrder: 0 },
      [String(s1bRef)]: { ref: s1bRef, name: 'Stem1 Slide 2', stemRef: branch1.ref, sortOrder: 1 },
      [String(s2aRef)]: { ref: s2aRef, name: 'Stem2 Slide 1', stemRef: branch2.ref, sortOrder: 0 },
      [String(s2bRef)]: { ref: s2bRef, name: 'Stem2 Slide 2', stemRef: branch2.ref, sortOrder: 1 }
    };

    const blockFor = (slideRef, name) => ({ ref: `block-${name}`, slideRef, name, sortOrder: 0, blockType: 'TEXT' });
    const blocksByRef = {
      s1: blockFor(s1Ref, 's1'),
      s2: blockFor(s2Ref, 's2'),
      s3: blockFor(s3Ref, 's3'),
      s1a: blockFor(s1aRef, 's1a'),
      s1b: blockFor(s1bRef, 's1b'),
      s2a: blockFor(s2aRef, 's2a'),
      s2b: blockFor(s2bRef, 's2b')
    };

    const result = await buildUserScenarioResponse(
      { userId: new mongoose.Types.ObjectId(), scenarioId, slidesByRef, blocksByRef },
      { models: db.models }
    );

    expect(result.blockResponses.map((b) => b.slideName)).toEqual([
      'Slide 1', 'Slide 2', 'Stem1 Slide 1', 'Stem1 Slide 2', 'Stem2 Slide 1', 'Stem2 Slide 2', 'Slide 3'
    ]);

    // Branch slides carry a stem prefix (fallback "Stem N" from sortOrder); root slides don't
    expect(result.blockResponses.map((b) => b.stemName)).toEqual([
      null, null, 'Stem 1', 'Stem 1', 'Stem 2', 'Stem 2', null
    ]);

    // slideSortOrder is within-stem, so branch slides restart at 0
    expect(result.blockResponses.map((b) => b.slideSortOrder)).toEqual([0, 1, 0, 1, 0, 1, 2]);
  });

  it('uses slideSortOrder=0 fallback when the slide is missing from slidesByRef', async () => {
    const blocksByRef = {
      'block-orphan': { ref: 'block-orphan', slideRef: 'missing-slide', name: 'O', sortOrder: 5, blockType: 'TEXT' }
    };

    const result = await buildUserScenarioResponse(
      { userId: new mongoose.Types.ObjectId(), scenarioId: new mongoose.Types.ObjectId(), slidesByRef: {}, blocksByRef },
      { models: db.models }
    );

    expect(result.blockResponses[0].slideSortOrder).toBe(0);
    expect(result.blockResponses[0].slideName).toBeUndefined();
  });
});
