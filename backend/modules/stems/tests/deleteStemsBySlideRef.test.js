import { describe, it, expect, beforeAll } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

import deleteStemsBySlideRef from '../services/deleteStemsBySlideRef.js';

const db = setupMongo();

let Slide;
let Block;
let Stem;
let Trigger;

beforeAll(() => {
  Slide = db.models.Slide;
  Block = db.models.Block;
  Stem = db.models.Stem;
  Trigger = db.models.Trigger;
});

const buildTrigger = (scenario, elementRef) => ({
  scenario,
  elementRef,
  triggerType: 'SLIDE',
  action: 'SHOW_FEEDBACK_FROM_PROMPTS'
});

const buildContext = () => ({
  models: db.models,
  user: { _id: new mongoose.Types.ObjectId() }
});

const isDeleted = async (Model, id) => (await Model.findById(id).lean()).isDeleted;

describe('deleteStemsBySlideRef (in-memory mongo)', () => {

  it('does nothing when the slide has no stems branching off it', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stem = await Stem.create({ scenario, isRoot: true });
    const [slide] = await Slide.create([{ scenario, stemRef: stem.ref, sortOrder: 0 }]);

    await deleteStemsBySlideRef({ slideRef: slide.ref, deletedAt: new Date() }, {}, buildContext());

    expect(await isDeleted(Stem, stem._id)).toBe(false);
    expect(await isDeleted(Slide, slide._id)).toBe(false);
  });

  it('deletes every stem branching off the slide, with their slides and blocks', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const [slide] = await Slide.create([{ scenario, sortOrder: 0 }]);

    const firstStem = await Stem.create({ scenario, slideRef: slide.ref, sortOrder: 0 });
    const secondStem = await Stem.create({ scenario, slideRef: slide.ref, sortOrder: 1 });

    const [firstStemSlide] = await Slide.create([{ scenario, stemRef: firstStem.ref, sortOrder: 0 }]);
    const [secondStemSlide] = await Slide.create([{ scenario, stemRef: secondStem.ref, sortOrder: 0 }]);
    const [block] = await Block.create([{ scenario, slideRef: secondStemSlide.ref }]);

    await deleteStemsBySlideRef({ slideRef: slide.ref, deletedAt: new Date() }, {}, buildContext());

    expect(await isDeleted(Stem, firstStem._id)).toBe(true);
    expect(await isDeleted(Stem, secondStem._id)).toBe(true);
    expect(await isDeleted(Slide, firstStemSlide._id)).toBe(true);
    expect(await isDeleted(Slide, secondStemSlide._id)).toBe(true);
    expect(await isDeleted(Block, block._id)).toBe(true);
  });

  it('walks down through nested stems', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const [slide] = await Slide.create([{ scenario, sortOrder: 0 }]);

    const branchStem = await Stem.create({ scenario, slideRef: slide.ref, sortOrder: 0 });
    const [branchSlide] = await Slide.create([{ scenario, stemRef: branchStem.ref, sortOrder: 0 }]);

    const nestedStem = await Stem.create({ scenario, slideRef: branchSlide.ref, sortOrder: 0 });
    const [nestedSlide] = await Slide.create([{ scenario, stemRef: nestedStem.ref, sortOrder: 0 }]);
    const [nestedBlock] = await Block.create([{ scenario, slideRef: nestedSlide.ref }]);

    await deleteStemsBySlideRef({ slideRef: slide.ref, deletedAt: new Date() }, {}, buildContext());

    expect(await isDeleted(Stem, nestedStem._id)).toBe(true);
    expect(await isDeleted(Slide, nestedSlide._id)).toBe(true);
    expect(await isDeleted(Block, nestedBlock._id)).toBe(true);
  });

  it('leaves stems on other slides untouched', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const [slide, otherSlide] = await Slide.create([
      { scenario, sortOrder: 0 },
      { scenario, sortOrder: 1 }
    ]);

    const stem = await Stem.create({ scenario, slideRef: slide.ref, sortOrder: 0 });
    const otherStem = await Stem.create({ scenario, slideRef: otherSlide.ref, sortOrder: 0 });
    const [otherStemSlide] = await Slide.create([{ scenario, stemRef: otherStem.ref, sortOrder: 0 }]);

    await deleteStemsBySlideRef({ slideRef: slide.ref, deletedAt: new Date() }, {}, buildContext());

    expect(await isDeleted(Stem, stem._id)).toBe(true);
    expect(await isDeleted(Stem, otherStem._id)).toBe(false);
    expect(await isDeleted(Slide, otherStemSlide._id)).toBe(false);
  });

  it('deletes the triggers on the branch slides, at every level', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const [slide, otherSlide] = await Slide.create([
      { scenario, sortOrder: 0 },
      { scenario, sortOrder: 1 }
    ]);

    const branchStem = await Stem.create({ scenario, slideRef: slide.ref, sortOrder: 0 });
    const [branchSlide] = await Slide.create([{ scenario, stemRef: branchStem.ref, sortOrder: 0 }]);

    const nestedStem = await Stem.create({ scenario, slideRef: branchSlide.ref, sortOrder: 0 });
    const [nestedSlide] = await Slide.create([{ scenario, stemRef: nestedStem.ref, sortOrder: 0 }]);

    const [branchTrigger, nestedTrigger, otherTrigger] = await Trigger.create([
      buildTrigger(scenario, branchSlide.ref),
      buildTrigger(scenario, nestedSlide.ref),
      buildTrigger(scenario, otherSlide.ref)
    ]);

    await deleteStemsBySlideRef({ slideRef: slide.ref, deletedAt: new Date() }, {}, buildContext());

    expect(await isDeleted(Trigger, branchTrigger._id)).toBe(true);
    expect(await isDeleted(Trigger, nestedTrigger._id)).toBe(true);
    expect(await isDeleted(Trigger, otherTrigger._id)).toBe(false);
  });

});
