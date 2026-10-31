import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock } = vi.hoisted(() => ({ checkAccessMock: vi.fn() }));

vi.mock('../helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));

import duplicateScenario from '../services/duplicateScenario.js';

const db = setupMongo();

const buildContext = () => ({ models: db.models, user: { _id: new mongoose.Types.ObjectId() }, connection: db.connection });

describe('duplicateScenario (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('points the duplicated branching options and default at the duplicated stems and blocks', async () => {
    const { Scenario, Stem, Slide, Block } = db.models;
    const scenario = await Scenario.create({ name: 'Branching' });

    const firstChildStem = await Stem.create({ scenario: scenario._id });
    const secondChildStem = await Stem.create({ scenario: scenario._id });
    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });

    const rootSlide = await Slide.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });
    await Slide.create({ scenario: scenario._id, stemRef: firstChildStem.ref, sortOrder: 0 });
    await Slide.create({ scenario: scenario._id, stemRef: secondChildStem.ref, sortOrder: 0 });
    const promptBlock = await Block.create({ scenario: scenario._id, slideRef: rootSlide.ref, blockType: 'INPUT_PROMPT' });

    rootStem.branchingOptions = [
      { stemRef: firstChildStem.ref, conditions: [{ prompts: [{ ref: promptBlock.ref, text: 'yes' }] }] },
      { stemRef: secondChildStem.ref, conditions: [] }
    ];
    rootStem.defaultBranchingStemRef = secondChildStem.ref;
    await rootStem.save();

    const newScenario = await duplicateScenario({ scenarioId: scenario._id }, {}, buildContext());

    const newStems = await Stem.find({ scenario: newScenario._id }).lean();
    const newRootStem = newStems.find((stem) => stem.isRoot);
    const newFirstChildStem = newStems.find((stem) => String(stem.originalRef) === String(firstChildStem.ref));
    const newSecondChildStem = newStems.find((stem) => String(stem.originalRef) === String(secondChildStem.ref));
    const newPromptBlock = await Block.findOne({ scenario: newScenario._id, originalRef: promptBlock.ref }).lean();

    expect(newRootStem.branchingOptions.map((branchingOption) => String(branchingOption.stemRef)))
      .toEqual([String(newFirstChildStem.ref), String(newSecondChildStem.ref)]);
    expect(String(newRootStem.branchingOptions[0].conditions[0].prompts[0].ref)).toBe(String(newPromptBlock.ref));
    expect(newRootStem.branchingOptions[0].conditions[0].prompts[0].text).toBe('yes');
    expect(String(newRootStem.defaultBranchingStemRef)).toBe(String(newSecondChildStem.ref));

    const originalRootStem = await Stem.findById(rootStem._id).lean();
    expect(String(originalRootStem.branchingOptions[0].stemRef)).toBe(String(firstChildStem.ref));
  });

  it('points the duplicated slide feedback conditions at the duplicated blocks', async () => {
    const { Scenario, Stem, Slide, Block } = db.models;
    const scenario = await Scenario.create({ name: 'Feedback' });

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    const slide = await Slide.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0, hasFeedback: true });
    const promptBlock = await Block.create({ scenario: scenario._id, slideRef: slide.ref, blockType: 'INPUT_PROMPT' });

    slide.feedbackItems = [{ conditions: [{ prompts: [{ ref: promptBlock.ref, text: 'yes' }] }] }];
    await slide.save();

    const newScenario = await duplicateScenario({ scenarioId: scenario._id }, {}, buildContext());

    const newSlide = await Slide.findOne({ scenario: newScenario._id, originalRef: slide.ref }).lean();
    const newPromptBlock = await Block.findOne({ scenario: newScenario._id, originalRef: promptBlock.ref }).lean();
    const [newPrompt] = newSlide.feedbackItems[0].conditions[0].prompts;

    expect(String(newPrompt.ref)).toBe(String(newPromptBlock.ref));
    expect(newPrompt.text).toBe('yes');

    const originalSlide = await Slide.findById(slide._id).lean();
    expect(String(originalSlide.feedbackItems[0].conditions[0].prompts[0].ref)).toBe(String(promptBlock.ref));
  });
});
