import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import find from 'lodash/find.js';
import map from 'lodash/map.js';
import { setupMongo } from '../../../tests/with-mongo.js';

const { connectDatabaseMock } = vi.hoisted(() => ({ connectDatabaseMock: vi.fn() }));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

import convertPromptOptionValuesToIds from '../convertPromptOptionValuesToIds.js';

const db = setupMongo();

const createMultipleChoiceBlock = async (Model, scenarioId, optionValues) => {
  const created = await Model.create({
    scenario: scenarioId,
    slideRef: new mongoose.Types.ObjectId(),
    blockType: 'MULTIPLE_CHOICE_PROMPT',
    options: map(optionValues, (value) => ({ value, 'en-US-text': value }))
  });

  return Model.findById(created._id).lean();
};

const optionIdForValue = (block, value) => String(find(block.options, { value })._id);

describe('convertPromptOptionValuesToIds (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({ models: db.models, close: vi.fn() });
  });

  it('converts draft trigger condition option values to their option _ids', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const block = await createMultipleChoiceBlock(db.models.Block, scenarioId, ['A', 'B']);

    const trigger = await db.models.Trigger.create({
      scenario: scenarioId,
      elementRef: new mongoose.Types.ObjectId(),
      triggerType: 'SLIDE',
      action: 'BRANCH_TO_STEM_FROM_PROMPTS',
      items: [{
        conditions: [{
          prompts: [{ ref: block.ref, options: ['A'] }]
        }]
      }]
    });

    await convertPromptOptionValuesToIds();

    const updated = await db.models.Trigger.findById(trigger._id).lean();
    const storedOptions = updated.items[0].conditions[0].prompts[0].options;
    expect(storedOptions).toEqual([optionIdForValue(block, 'A')]);
  });

  it('converts published trigger conditions and run tracking against published blocks', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const publishedBlock = await createMultipleChoiceBlock(db.models.Published_Block, scenarioId, ['Yes', 'No']);

    const publishedTrigger = await db.models.Published_Trigger.create({
      scenario: scenarioId,
      elementRef: new mongoose.Types.ObjectId(),
      triggerType: 'SLIDE',
      action: 'SHOW_FEEDBACK_FROM_PROMPTS',
      items: [{
        conditions: [{
          prompts: [{ ref: publishedBlock.ref, options: ['Yes'] }]
        }]
      }]
    });

    const run = await db.models.Run.create({
      scenario: scenarioId,
      user: new mongoose.Types.ObjectId(),
      stages: [{
        slideRef: 'slide-1',
        blocksByRef: {
          [String(publishedBlock.ref)]: { selectedOptions: ['Yes'], isComplete: true }
        }
      }]
    });

    await convertPromptOptionValuesToIds();

    const yesId = optionIdForValue(publishedBlock, 'Yes');

    const updatedTrigger = await db.models.Published_Trigger.findById(publishedTrigger._id).lean();
    expect(updatedTrigger.items[0].conditions[0].prompts[0].options).toEqual([yesId]);

    const updatedRun = await db.models.Run.findById(run._id).lean();
    expect(updatedRun.stages[0].blocksByRef[String(publishedBlock.ref)].selectedOptions).toEqual([yesId]);
  });

  it('is idempotent — a second run leaves already-migrated _ids untouched', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const block = await createMultipleChoiceBlock(db.models.Block, scenarioId, ['A', 'B']);

    const trigger = await db.models.Trigger.create({
      scenario: scenarioId,
      elementRef: new mongoose.Types.ObjectId(),
      triggerType: 'SLIDE',
      action: 'BRANCH_TO_STEM_FROM_PROMPTS',
      items: [{
        conditions: [{
          prompts: [{ ref: block.ref, options: ['A'] }]
        }]
      }]
    });

    await convertPromptOptionValuesToIds();
    await convertPromptOptionValuesToIds();

    const updated = await db.models.Trigger.findById(trigger._id).lean();
    expect(updated.items[0].conditions[0].prompts[0].options).toEqual([optionIdForValue(block, 'A')]);
  });

  it('leaves unmappable values (edited or deleted options) as-is', async () => {
    const scenarioId = new mongoose.Types.ObjectId();
    const block = await createMultipleChoiceBlock(db.models.Block, scenarioId, ['A', 'B']);

    const trigger = await db.models.Trigger.create({
      scenario: scenarioId,
      elementRef: new mongoose.Types.ObjectId(),
      triggerType: 'SLIDE',
      action: 'BRANCH_TO_STEM_FROM_PROMPTS',
      items: [{
        conditions: [{
          prompts: [{ ref: block.ref, options: ['GONE'] }]
        }]
      }]
    });

    await convertPromptOptionValuesToIds();

    const updated = await db.models.Trigger.findById(trigger._id).lean();
    expect(updated.items[0].conditions[0].prompts[0].options).toEqual(['GONE']);
  });
});
