import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../tests/with-mongo.js';

const { connectDatabaseMock } = vi.hoisted(() => ({ connectDatabaseMock: vi.fn() }));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

import removeOrphanedStems from '../removeOrphanedStems.js';

const db = setupMongo();

const createScenario = (Model, name) => Model.create({ name });

const createTrigger = (Model, scenario, elementRef) => Model.create({
  scenario,
  elementRef,
  triggerType: 'SLIDE',
  action: 'SHOW_FEEDBACK_FROM_PROMPTS'
});

const isDeleted = async (Model, id) => (await Model.findById(id).lean()).isDeleted;

describe('removeOrphanedStems (in-memory mongo)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({ models: db.models, close: vi.fn() });
  });

  it('removes a stem left behind when its parent slide was deleted, with its slides, blocks and triggers', async () => {
    const { Scenario, Stem, Slide, Block, Trigger } = db.models;
    const scenario = await createScenario(Scenario, 'Orphan');

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    const rootSlide = await Slide.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });

    const deletedSlide = await Slide.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 1, isDeleted: true });

    const orphanedStem = await Stem.create({ scenario: scenario._id, slideRef: deletedSlide.ref, sortOrder: 0 });
    const orphanedSlide = await Slide.create({ scenario: scenario._id, stemRef: orphanedStem.ref, sortOrder: 0 });
    const orphanedBlock = await Block.create({ scenario: scenario._id, slideRef: orphanedSlide.ref });
    const orphanedTrigger = await createTrigger(Trigger, scenario._id, orphanedSlide.ref);

    const rootBlock = await Block.create({ scenario: scenario._id, slideRef: rootSlide.ref });
    const rootTrigger = await createTrigger(Trigger, scenario._id, rootSlide.ref);

    await removeOrphanedStems();

    expect(await isDeleted(Stem, orphanedStem._id)).toBe(true);
    expect(await isDeleted(Slide, orphanedSlide._id)).toBe(true);
    expect(await isDeleted(Block, orphanedBlock._id)).toBe(true);
    expect(await isDeleted(Trigger, orphanedTrigger._id)).toBe(true);

    expect(await isDeleted(Stem, rootStem._id)).toBe(false);
    expect(await isDeleted(Slide, rootSlide._id)).toBe(false);
    expect(await isDeleted(Block, rootBlock._id)).toBe(false);
    expect(await isDeleted(Trigger, rootTrigger._id)).toBe(false);
  });

  it('removes stems nested underneath an orphaned slide', async () => {
    const { Scenario, Stem, Slide } = db.models;
    const scenario = await createScenario(Scenario, 'Nested orphan');

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    await Slide.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });

    const missingSlideRef = new mongoose.Types.ObjectId();
    const orphanedStem = await Stem.create({ scenario: scenario._id, slideRef: missingSlideRef, sortOrder: 0 });
    const orphanedSlide = await Slide.create({ scenario: scenario._id, stemRef: orphanedStem.ref, sortOrder: 0 });

    const nestedStem = await Stem.create({ scenario: scenario._id, slideRef: orphanedSlide.ref, sortOrder: 0 });
    const nestedSlide = await Slide.create({ scenario: scenario._id, stemRef: nestedStem.ref, sortOrder: 0 });

    await removeOrphanedStems();

    expect(await isDeleted(Stem, nestedStem._id)).toBe(true);
    expect(await isDeleted(Slide, nestedSlide._id)).toBe(true);
  });

  it('leaves a healthy scenario untouched', async () => {
    const { Scenario, Stem, Slide } = db.models;
    const scenario = await createScenario(Scenario, 'Healthy');

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    const rootSlide = await Slide.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });

    const branchStem = await Stem.create({ scenario: scenario._id, slideRef: rootSlide.ref, sortOrder: 0 });
    const branchSlide = await Slide.create({ scenario: scenario._id, stemRef: branchStem.ref, sortOrder: 0 });

    await removeOrphanedStems();

    expect(await isDeleted(Stem, rootStem._id)).toBe(false);
    expect(await isDeleted(Stem, branchStem._id)).toBe(false);
    expect(await isDeleted(Slide, rootSlide._id)).toBe(false);
    expect(await isDeleted(Slide, branchSlide._id)).toBe(false);
  });

  it('skips a scenario that has no root stem', async () => {
    const { Scenario, Stem, Slide } = db.models;
    const scenario = await createScenario(Scenario, 'No root');

    const stem = await Stem.create({ scenario: scenario._id, sortOrder: 0 });
    const slide = await Slide.create({ scenario: scenario._id, stemRef: stem.ref, sortOrder: 0 });

    await removeOrphanedStems();

    expect(await isDeleted(Stem, stem._id)).toBe(false);
    expect(await isDeleted(Slide, slide._id)).toBe(false);
  });

  it('skips a scenario where a slide has no stemRef', async () => {
    const { Scenario, Stem, Slide } = db.models;
    const scenario = await createScenario(Scenario, 'Unmigrated');

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    const slideWithoutStem = await Slide.create({ scenario: scenario._id, sortOrder: 0 });

    const orphanedStem = await Stem.create({ scenario: scenario._id, slideRef: new mongoose.Types.ObjectId(), sortOrder: 0 });

    await removeOrphanedStems();

    expect(await isDeleted(Slide, slideWithoutStem._id)).toBe(false);
    expect(await isDeleted(Stem, orphanedStem._id)).toBe(false);
    expect(await isDeleted(Stem, rootStem._id)).toBe(false);
  });

  it('cleans published collections too', async () => {
    const { Published_Scenario, Published_Stem, Published_Slide, Published_Block } = db.models;
    const scenario = await createScenario(Published_Scenario, 'Published orphan');

    const rootStem = await Published_Stem.create({ scenario: scenario._id, isRoot: true });
    await Published_Slide.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });

    const orphanedStem = await Published_Stem.create({ scenario: scenario._id, slideRef: new mongoose.Types.ObjectId(), sortOrder: 0 });
    const orphanedSlide = await Published_Slide.create({ scenario: scenario._id, stemRef: orphanedStem.ref, sortOrder: 0 });
    const orphanedBlock = await Published_Block.create({ scenario: scenario._id, slideRef: orphanedSlide.ref });

    await removeOrphanedStems();

    expect(await isDeleted(Published_Stem, orphanedStem._id)).toBe(true);
    expect(await isDeleted(Published_Slide, orphanedSlide._id)).toBe(true);
    expect(await isDeleted(Published_Block, orphanedBlock._id)).toBe(true);
  });

  it('leaves slides that are already deleted alone', async () => {
    const { Scenario, Stem, Slide } = db.models;
    const scenario = await createScenario(Scenario, 'Already deleted');
    const originalDeletedAt = new Date('2020-01-01');

    const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
    await Slide.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder: 0 });

    const deletedOrphan = await Slide.create({
      scenario: scenario._id,
      stemRef: new mongoose.Types.ObjectId(),
      sortOrder: 0,
      isDeleted: true,
      deletedAt: originalDeletedAt
    });

    await removeOrphanedStems();

    expect((await Slide.findById(deletedOrphan._id).lean()).deletedAt).toEqual(originalDeletedAt);
  });

});
