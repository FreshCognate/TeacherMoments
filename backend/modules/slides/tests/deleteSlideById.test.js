import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import sortBy from 'lodash/sortBy.js';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setHasChangesMock(...args)
}));

import deleteSlideById from '../services/deleteSlideById.js';
import getSlideOrderByStemTraversal from '../helpers/getSlideOrderByStemTraversal.js';

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
  user: { _id: new mongoose.Types.ObjectId() },
  connection: db.connection
});

const sortOrdersFor = async (scenarioId, stemRef) => {
  const slides = await Slide.find({ scenario: scenarioId, stemRef, isDeleted: false }).lean();
  return sortBy(slides, 'sortOrder').map((slide) => slide.sortOrder);
};

describe('deleteSlideById (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws 404 when the slide does not exist', async () => {
    await expect(
      deleteSlideById({ slideId: new mongoose.Types.ObjectId() }, {}, buildContext())
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('soft-deletes the slide and reindexes the remaining siblings in its stem from 0', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const [first, second, third] = await Slide.create([
      { scenario, stemRef, sortOrder: 0 },
      { scenario, stemRef, sortOrder: 1 },
      { scenario, stemRef, sortOrder: 2 }
    ]);

    await deleteSlideById({ slideId: second._id }, {}, buildContext());

    const deleted = await Slide.findById(second._id).lean();
    expect(deleted.isDeleted).toBe(true);

    expect(await sortOrdersFor(scenario, stemRef)).toEqual([0, 1]);

    const survivors = sortBy(
      await Slide.find({ scenario, stemRef, isDeleted: false }).lean(),
      'sortOrder'
    ).map((slide) => String(slide._id));
    expect(survivors).toEqual([String(first._id), String(third._id)]);

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: scenario }, {}, expect.any(Object));
  });

  it('only reindexes siblings within the deleted slide\'s stem, leaving other stems untouched', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemA = new mongoose.Types.ObjectId();
    const stemB = new mongoose.Types.ObjectId();

    const [, stemAMiddle] = await Slide.create([
      { scenario, stemRef: stemA, sortOrder: 0 },
      { scenario, stemRef: stemA, sortOrder: 1 },
      { scenario, stemRef: stemA, sortOrder: 2 }
    ]);

    await Slide.create([
      { scenario, stemRef: stemB, sortOrder: 0 },
      { scenario, stemRef: stemB, sortOrder: 1 }
    ]);

    await deleteSlideById({ slideId: stemAMiddle._id }, {}, buildContext());

    expect(await sortOrdersFor(scenario, stemA)).toEqual([0, 1]);
    expect(await sortOrdersFor(scenario, stemB)).toEqual([0, 1]);
  });

  it('soft-deletes the blocks belonging to the slide', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const [slide] = await Slide.create([{ scenario, stemRef, sortOrder: 0 }]);
    await Block.create([
      { slideRef: slide.ref, scenario },
      { slideRef: slide.ref, scenario }
    ]);

    await deleteSlideById({ slideId: slide._id }, {}, buildContext());


    const remainingActiveBlocks = await Block.countDocuments({ slideRef: slide.ref, isDeleted: false });
    expect(remainingActiveBlocks).toBe(0);
  });
  it('soft-deletes the stems branching off the slide, along with their slides and blocks', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const rootStem = await Stem.create({ scenario, isRoot: true });

    const [parentSlide, siblingSlide] = await Slide.create([
      { scenario, stemRef: rootStem.ref, sortOrder: 0 },
      { scenario, stemRef: rootStem.ref, sortOrder: 1 }
    ]);

    const branchStem = await Stem.create({ scenario, slideRef: parentSlide.ref, sortOrder: 0 });
    const [branchSlide] = await Slide.create([{ scenario, stemRef: branchStem.ref, sortOrder: 0 }]);
    const [branchBlock] = await Block.create([{ scenario, slideRef: branchSlide.ref }]);

    const untouchedStem = await Stem.create({ scenario, slideRef: siblingSlide.ref, sortOrder: 0 });
    const [untouchedSlide] = await Slide.create([{ scenario, stemRef: untouchedStem.ref, sortOrder: 0 }]);

    await deleteSlideById({ slideId: parentSlide._id }, {}, buildContext());

    expect((await Stem.findById(branchStem._id).lean()).isDeleted).toBe(true);
    expect((await Slide.findById(branchSlide._id).lean()).isDeleted).toBe(true);
    expect((await Block.findById(branchBlock._id).lean()).isDeleted).toBe(true);

    expect((await Stem.findById(untouchedStem._id).lean()).isDeleted).toBe(false);
    expect((await Slide.findById(untouchedSlide._id).lean()).isDeleted).toBe(false);
    expect((await Stem.findById(rootStem._id).lean()).isDeleted).toBe(false);
  });

  it('cascades through nested stems so no slide is left unreachable', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const rootStem = await Stem.create({ scenario, isRoot: true });

    const [parentSlide] = await Slide.create([{ scenario, stemRef: rootStem.ref, sortOrder: 0 }]);

    const branchStem = await Stem.create({ scenario, slideRef: parentSlide.ref, sortOrder: 0 });
    const [branchSlide] = await Slide.create([{ scenario, stemRef: branchStem.ref, sortOrder: 0 }]);

    const nestedStem = await Stem.create({ scenario, slideRef: branchSlide.ref, sortOrder: 0 });
    const [nestedSlide] = await Slide.create([{ scenario, stemRef: nestedStem.ref, sortOrder: 0 }]);
    const [nestedBlock] = await Block.create([{ scenario, slideRef: nestedSlide.ref }]);

    await deleteSlideById({ slideId: parentSlide._id }, {}, buildContext());

    expect((await Stem.findById(nestedStem._id).lean()).isDeleted).toBe(true);
    expect((await Slide.findById(nestedSlide._id).lean()).isDeleted).toBe(true);
    expect((await Block.findById(nestedBlock._id).lean()).isDeleted).toBe(true);

    const liveSlides = await Slide.find({ scenario, isDeleted: false }).lean();
    const liveStems = await Stem.find({ scenario, isDeleted: false }).lean();
    const order = getSlideOrderByStemTraversal({ slides: liveSlides, stems: liveStems });
    expect(order.size).toBe(liveSlides.length);
  });
  it('soft-deletes the triggers belonging to the slide, leaving other slides\' triggers alone', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const [slide, otherSlide] = await Slide.create([
      { scenario, stemRef, sortOrder: 0 },
      { scenario, stemRef, sortOrder: 1 }
    ]);

    const [firstTrigger, secondTrigger, otherTrigger] = await Trigger.create([
      buildTrigger(scenario, slide.ref),
      buildTrigger(scenario, slide.ref),
      buildTrigger(scenario, otherSlide.ref)
    ]);

    await deleteSlideById({ slideId: slide._id }, {}, buildContext());

    expect((await Trigger.findById(firstTrigger._id).lean()).isDeleted).toBe(true);
    expect((await Trigger.findById(secondTrigger._id).lean()).isDeleted).toBe(true);
    expect((await Trigger.findById(otherTrigger._id).lean()).isDeleted).toBe(false);
  });
  it('leaves the deletion stamp on blocks that were already deleted', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();
    const originalDeletedAt = new Date('2020-01-01');

    const [slide] = await Slide.create([{ scenario, stemRef, sortOrder: 0 }]);
    const [activeBlock, alreadyDeletedBlock] = await Block.create([
      { scenario, slideRef: slide.ref },
      { scenario, slideRef: slide.ref, isDeleted: true, deletedAt: originalDeletedAt }
    ]);

    await deleteSlideById({ slideId: slide._id }, {}, buildContext());

    expect((await Block.findById(activeBlock._id).lean()).isDeleted).toBe(true);
    expect((await Block.findById(alreadyDeletedBlock._id).lean()).deletedAt).toEqual(originalDeletedAt);
  });
  it('rolls the whole delete back when one of the cascade steps fails', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const rootStem = await Stem.create({ scenario, isRoot: true });

    const [slide] = await Slide.create([{ scenario, stemRef: rootStem.ref, sortOrder: 0 }]);
    const branchStem = await Stem.create({ scenario, slideRef: slide.ref, sortOrder: 0 });
    const [block] = await Block.create([{ scenario, slideRef: slide.ref }]);
    const trigger = await Trigger.create(buildTrigger(scenario, slide.ref));

    const failingStemUpdate = vi
      .spyOn(Stem, 'updateMany')
      .mockRejectedValueOnce(new Error('cascade blew up'));

    await expect(
      deleteSlideById({ slideId: slide._id }, {}, buildContext())
    ).rejects.toMatchObject({ statusCode: 500 });

    failingStemUpdate.mockRestore();

    expect((await Slide.findById(slide._id).lean()).isDeleted).toBe(false);
    expect((await Block.findById(block._id).lean()).isDeleted).toBe(false);
    expect((await Trigger.findById(trigger._id).lean()).isDeleted).toBe(false);
    expect((await Stem.findById(branchStem._id).lean()).isDeleted).toBe(false);
  });
});
