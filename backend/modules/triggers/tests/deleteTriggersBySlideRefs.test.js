import { describe, it, expect, beforeAll } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

import deleteTriggersBySlideRefs from '../services/deleteTriggersBySlideRefs.js';

const db = setupMongo();

let Trigger;

beforeAll(() => {
  Trigger = db.models.Trigger;
});

const buildContext = () => ({
  models: db.models,
  user: { _id: new mongoose.Types.ObjectId() }
});

const buildTrigger = (scenario, elementRef) => ({
  scenario,
  elementRef,
  triggerType: 'SLIDE',
  action: 'SHOW_FEEDBACK_FROM_PROMPTS'
});

describe('deleteTriggersBySlideRefs (in-memory mongo)', () => {

  it('does nothing when given no slide refs', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    const trigger = await Trigger.create(buildTrigger(scenario, slideRef));

    await deleteTriggersBySlideRefs({ slideRefs: [], deletedAt: new Date() }, {}, buildContext());

    expect((await Trigger.findById(trigger._id).lean()).isDeleted).toBe(false);
  });

  it('soft-deletes every trigger belonging to the given slides', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const firstSlideRef = new mongoose.Types.ObjectId();
    const secondSlideRef = new mongoose.Types.ObjectId();

    const [firstTrigger, secondTrigger, thirdTrigger] = await Trigger.create([
      buildTrigger(scenario, firstSlideRef),
      buildTrigger(scenario, firstSlideRef),
      buildTrigger(scenario, secondSlideRef)
    ]);

    const deletedAt = new Date();
    const context = buildContext();

    await deleteTriggersBySlideRefs({ slideRefs: [firstSlideRef, secondSlideRef], deletedAt }, {}, context);

    const first = await Trigger.findById(firstTrigger._id).lean();
    expect(first.isDeleted).toBe(true);
    expect(first.deletedAt).toEqual(deletedAt);
    expect(String(first.deletedBy)).toBe(String(context.user._id));

    expect((await Trigger.findById(secondTrigger._id).lean()).isDeleted).toBe(true);
    expect((await Trigger.findById(thirdTrigger._id).lean()).isDeleted).toBe(true);
  });

  it('leaves triggers on other slides untouched', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    const otherSlideRef = new mongoose.Types.ObjectId();

    const [trigger, otherTrigger] = await Trigger.create([
      buildTrigger(scenario, slideRef),
      buildTrigger(scenario, otherSlideRef)
    ]);

    await deleteTriggersBySlideRefs({ slideRefs: [slideRef], deletedAt: new Date() }, {}, buildContext());

    expect((await Trigger.findById(trigger._id).lean()).isDeleted).toBe(true);
    expect((await Trigger.findById(otherTrigger._id).lean()).isDeleted).toBe(false);
  });

  it('does not touch triggers that are already deleted', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const slideRef = new mongoose.Types.ObjectId();
    const originalDeletedAt = new Date('2020-01-01');

    const trigger = await Trigger.create({
      ...buildTrigger(scenario, slideRef),
      isDeleted: true,
      deletedAt: originalDeletedAt
    });

    await deleteTriggersBySlideRefs({ slideRefs: [slideRef], deletedAt: new Date() }, {}, buildContext());

    expect((await Trigger.findById(trigger._id).lean()).deletedAt).toEqual(originalDeletedAt);
  });

});
