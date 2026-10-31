import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({ default: (...args) => setHasChangesMock(...args) }));

import deleteStemById from '../services/deleteStemById.js';

const db = setupMongo();

const linkTo = (stem) => ({ stemRef: stem.ref, conditions: [] });

const isDeleted = async (Model, id) => (await Model.findById(id).lean()).isDeleted;

const buildContext = () => ({ models: db.models, user: { _id: new mongoose.Types.ObjectId() }, connection: db.connection });

describe('deleteStemById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws 404 when the stem does not exist', async () => {
    await expect(
      deleteStemById({ stemId: new mongoose.Types.ObjectId() }, {}, {
        models: db.models, user: { _id: new mongoose.Types.ObjectId() }, connection: db.connection
      })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('soft-deletes the stem and cascades to its slides and blocks', async () => {
    const scenario = new mongoose.Types.ObjectId();

    const stem = await db.models.Stem.create({ scenario, isRoot: true });

    const slide = await db.models.Slide.create({ scenario, stemRef: stem.ref, sortOrder: 0 });
    const otherSlide = await db.models.Slide.create({ scenario, stemRef: stem.ref, sortOrder: 1 });

    const block = await db.models.Block.create({ scenario, slideRef: slide.ref });
    const otherBlock = await db.models.Block.create({ scenario, slideRef: otherSlide.ref });

    const ctx = { models: db.models, user: { _id: new mongoose.Types.ObjectId() }, connection: db.connection };
    const result = await deleteStemById({ stemId: stem._id }, {}, ctx);

    const isDeleted = async (Model, id) => (await Model.findById(id).lean()).isDeleted;

    // The stem and its slides (which carry stemRef) cascade-delete.
    expect(await isDeleted(db.models.Stem, stem._id)).toBe(true);
    expect(await isDeleted(db.models.Slide, slide._id)).toBe(true);
    expect(await isDeleted(db.models.Slide, otherSlide._id)).toBe(true);

    // Blocks are reached through their slide (block.slideRef === slide.ref).
    expect(await isDeleted(db.models.Block, block._id)).toBe(true);
    expect(await isDeleted(db.models.Block, otherBlock._id)).toBe(true);

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, ctx);
    expect(String(result._id)).toBe(String(stem._id));
  });
  it('cascades to descendant stems and their slides and blocks', async () => {
    const scenario = new mongoose.Types.ObjectId();

    const grandchildStem = await db.models.Stem.create({ scenario });
    const childStem = await db.models.Stem.create({ scenario, branchingOptions: [linkTo(grandchildStem)] });
    const stem = await db.models.Stem.create({ scenario, branchingOptions: [linkTo(childStem)] });
    const siblingStem = await db.models.Stem.create({ scenario });

    const childSlide = await db.models.Slide.create({ scenario, stemRef: childStem.ref, sortOrder: 0 });
    const grandchildSlide = await db.models.Slide.create({ scenario, stemRef: grandchildStem.ref, sortOrder: 0 });
    const siblingSlide = await db.models.Slide.create({ scenario, stemRef: siblingStem.ref, sortOrder: 0 });

    const grandchildBlock = await db.models.Block.create({ scenario, slideRef: grandchildSlide.ref });

    await deleteStemById({ stemId: stem._id }, {}, {
      models: db.models, user: { _id: new mongoose.Types.ObjectId() }, connection: db.connection
    });

    const isDeleted = async (Model, id) => (await Model.findById(id).lean()).isDeleted;

    expect(await isDeleted(db.models.Stem, childStem._id)).toBe(true);
    expect(await isDeleted(db.models.Stem, grandchildStem._id)).toBe(true);
    expect(await isDeleted(db.models.Slide, childSlide._id)).toBe(true);
    expect(await isDeleted(db.models.Slide, grandchildSlide._id)).toBe(true);
    expect(await isDeleted(db.models.Block, grandchildBlock._id)).toBe(true);

    expect(await isDeleted(db.models.Stem, siblingStem._id)).toBe(false);
    expect(await isDeleted(db.models.Slide, siblingSlide._id)).toBe(false);
  });

  it('cascades to the triggers on the stem\'s slides', async () => {
    const scenario = new mongoose.Types.ObjectId();

    const stem = await db.models.Stem.create({ scenario, isRoot: true });
    const otherStem = await db.models.Stem.create({ scenario, sortOrder: 0 });

    const slide = await db.models.Slide.create({ scenario, stemRef: stem.ref, sortOrder: 0 });
    const otherSlide = await db.models.Slide.create({ scenario, stemRef: otherStem.ref, sortOrder: 0 });

    const buildTrigger = (elementRef) => ({
      scenario,
      elementRef,
      triggerType: 'SLIDE',
      action: 'SHOW_FEEDBACK_FROM_PROMPTS'
    });

    const trigger = await db.models.Trigger.create(buildTrigger(slide.ref));
    const otherTrigger = await db.models.Trigger.create(buildTrigger(otherSlide.ref));

    await deleteStemById({ stemId: stem._id }, {}, {
      models: db.models, user: { _id: new mongoose.Types.ObjectId() }, connection: db.connection
    });

    expect((await db.models.Trigger.findById(trigger._id).lean()).isDeleted).toBe(true);
    expect((await db.models.Trigger.findById(otherTrigger._id).lean()).isDeleted).toBe(false);
  });

  it('removes the stem from its parent branching options and clears it as the default', async () => {
    const scenario = new mongoose.Types.ObjectId();

    const stem = await db.models.Stem.create({ scenario });
    const siblingStem = await db.models.Stem.create({ scenario });
    const parentStem = await db.models.Stem.create({
      scenario,
      isRoot: true,
      branchingOptions: [linkTo(stem), linkTo(siblingStem)],
      defaultBranchingStemRef: stem.ref
    });

    await deleteStemById({ stemId: stem._id }, {}, buildContext());

    const updatedParentStem = await db.models.Stem.findById(parentStem._id).lean();

    expect(updatedParentStem.branchingOptions.map((branchingOption) => String(branchingOption.stemRef))).toEqual([String(siblingStem.ref)]);
    expect(updatedParentStem.defaultBranchingStemRef).toBeNull();
  });

  it('keeps a child stem that another live stem still branches to', async () => {
    const scenario = new mongoose.Types.ObjectId();

    const sharedStem = await db.models.Stem.create({ scenario });
    const sharedSlide = await db.models.Slide.create({ scenario, stemRef: sharedStem.ref, sortOrder: 0 });
    const stem = await db.models.Stem.create({ scenario, branchingOptions: [linkTo(sharedStem)] });
    const otherStem = await db.models.Stem.create({ scenario, branchingOptions: [linkTo(sharedStem)] });

    await deleteStemById({ stemId: stem._id }, {}, buildContext());

    expect(await isDeleted(db.models.Stem, stem._id)).toBe(true);
    expect(await isDeleted(db.models.Stem, sharedStem._id)).toBe(false);
    expect(await isDeleted(db.models.Slide, sharedSlide._id)).toBe(false);
    expect(await isDeleted(db.models.Stem, otherStem._id)).toBe(false);
  });

  it('deletes a shared stem once every stem branching to it is deleted', async () => {
    const scenario = new mongoose.Types.ObjectId();

    const sharedStem = await db.models.Stem.create({ scenario });
    const firstBranchStem = await db.models.Stem.create({ scenario, branchingOptions: [linkTo(sharedStem)] });
    const secondBranchStem = await db.models.Stem.create({ scenario, branchingOptions: [linkTo(sharedStem)] });
    const stem = await db.models.Stem.create({ scenario, branchingOptions: [linkTo(firstBranchStem), linkTo(secondBranchStem)] });

    await deleteStemById({ stemId: stem._id }, {}, buildContext());

    expect(await isDeleted(db.models.Stem, firstBranchStem._id)).toBe(true);
    expect(await isDeleted(db.models.Stem, secondBranchStem._id)).toBe(true);
    expect(await isDeleted(db.models.Stem, sharedStem._id)).toBe(true);
  });

  it('deletes a stem linked both directly and through a deeper branch once both links are deleted', async () => {
    const scenario = new mongoose.Types.ObjectId();

    const sharedStem = await db.models.Stem.create({ scenario });
    const branchStem = await db.models.Stem.create({ scenario, branchingOptions: [linkTo(sharedStem)] });
    const stem = await db.models.Stem.create({ scenario, branchingOptions: [linkTo(branchStem), linkTo(sharedStem)] });

    await deleteStemById({ stemId: stem._id }, {}, buildContext());

    expect(await isDeleted(db.models.Stem, branchStem._id)).toBe(true);
    expect(await isDeleted(db.models.Stem, sharedStem._id)).toBe(true);
  });
});
