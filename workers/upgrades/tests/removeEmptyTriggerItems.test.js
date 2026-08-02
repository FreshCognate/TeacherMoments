import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../tests/with-mongo.js';

const { connectDatabaseMock } = vi.hoisted(() => ({ connectDatabaseMock: vi.fn() }));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

import removeEmptyTriggerItems from '../removeEmptyTriggerItems.js';

const db = setupMongo();

const createTrigger = (Model, { action, items }) => Model.create({
  scenario: new mongoose.Types.ObjectId(),
  elementRef: new mongoose.Types.ObjectId(),
  triggerType: 'SLIDE',
  action,
  items
});

describe('removeEmptyTriggerItems (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({ models: db.models, close: vi.fn() });
  });

  it('removes branch trigger items that have no elementRef and no conditions', async () => {
    const stemRef = new mongoose.Types.ObjectId();

    const trigger = await createTrigger(db.models.Trigger, {
      action: 'BRANCH_TO_STEM_FROM_PROMPTS',
      items: [
        {},
        { elementRef: stemRef, conditions: [{ prompts: [{ ref: new mongoose.Types.ObjectId() }] }] }
      ]
    });

    await removeEmptyTriggerItems();

    const updated = await db.models.Trigger.findById(trigger._id).lean();
    expect(updated.items).toHaveLength(1);
    expect(String(updated.items[0].elementRef)).toEqual(String(stemRef));
  });

  it('removes the same items from published triggers', async () => {
    const stemRef = new mongoose.Types.ObjectId();

    const publishedTrigger = await createTrigger(db.models.Published_Trigger, {
      action: 'BRANCH_TO_STEM_FROM_PROMPTS',
      items: [{}, { elementRef: stemRef, conditions: [] }]
    });

    await removeEmptyTriggerItems();

    const updated = await db.models.Published_Trigger.findById(publishedTrigger._id).lean();
    expect(updated.items).toHaveLength(1);
    expect(String(updated.items[0].elementRef)).toEqual(String(stemRef));
  });

  it('keeps branch items that have an elementRef but no conditions (the default stem)', async () => {
    const stemRef = new mongoose.Types.ObjectId();

    const trigger = await createTrigger(db.models.Trigger, {
      action: 'BRANCH_TO_STEM_FROM_PROMPTS',
      items: [{ elementRef: stemRef, conditions: [] }]
    });

    await removeEmptyTriggerItems();

    const updated = await db.models.Trigger.findById(trigger._id).lean();
    expect(updated.items).toHaveLength(1);
  });

  it('keeps items with no elementRef when they still have conditions', async () => {
    const trigger = await createTrigger(db.models.Trigger, {
      action: 'BRANCH_TO_STEM_FROM_PROMPTS',
      items: [{ conditions: [{ prompts: [{ ref: new mongoose.Types.ObjectId(), text: 'keep me' }] }] }]
    });

    await removeEmptyTriggerItems();

    const updated = await db.models.Trigger.findById(trigger._id).lean();
    expect(updated.items).toHaveLength(1);
    expect(updated.items[0].conditions[0].prompts[0].text).toEqual('keep me');
  });

  it('leaves feedback triggers untouched', async () => {
    const trigger = await createTrigger(db.models.Trigger, {
      action: 'SHOW_FEEDBACK_FROM_PROMPTS',
      items: [{}]
    });

    await removeEmptyTriggerItems();

    const updated = await db.models.Trigger.findById(trigger._id).lean();
    expect(updated.items).toHaveLength(1);
  });

  it('is idempotent — a second run changes nothing', async () => {
    const stemRef = new mongoose.Types.ObjectId();

    const trigger = await createTrigger(db.models.Trigger, {
      action: 'BRANCH_TO_STEM_FROM_PROMPTS',
      items: [{}, { elementRef: stemRef, conditions: [] }]
    });

    await removeEmptyTriggerItems();
    const afterFirstRun = await db.models.Trigger.findById(trigger._id).lean();

    await removeEmptyTriggerItems();
    const afterSecondRun = await db.models.Trigger.findById(trigger._id).lean();

    expect(afterSecondRun.items).toHaveLength(1);
    expect(afterSecondRun.updatedAt).toEqual(afterFirstRun.updatedAt);
  });
});
