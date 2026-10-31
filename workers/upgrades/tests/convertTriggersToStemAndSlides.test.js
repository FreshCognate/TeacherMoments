import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import map from 'lodash/map.js';
import sortBy from 'lodash/sortBy.js';
import { setupMongo } from '../../../tests/with-mongo.js';

const { connectDatabaseMock } = vi.hoisted(() => ({ connectDatabaseMock: vi.fn() }));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

import convertTriggersToStemAndSlides from '../convertTriggersToStemAndSlides.js';

const db = setupMongo();

const getDocument = (Model, id) => Model.findById(id).lean();

const getBranchingOptionStemRefs = (stem) => map(stem.branchingOptions, (branchingOption) => String(branchingOption.stemRef));

const getStemSlideRefs = async (Slide, stemRef) => {
  const slides = await Slide.find({ stemRef, isDeleted: false }).lean();
  return map(sortBy(slides, 'sortOrder'), (slide) => String(slide.ref));
};

const buildCondition = (promptRef) => ({ prompts: [{ ref: promptRef, text: 'yes' }] });

const createOldScenario = async ({ Scenario, Stem, Slide }, { name, rootSlideCount }) => {
  const scenario = await Scenario.create({ name });
  const rootStem = await Stem.create({ scenario: scenario._id, isRoot: true });
  const rootSlides = [];

  for (let sortOrder = 0; sortOrder < rootSlideCount; sortOrder++) {
    rootSlides.push(await Slide.create({ scenario: scenario._id, stemRef: rootStem.ref, sortOrder }));
  }

  return { scenario, rootStem, rootSlides };
};

const createBranchStem = async ({ Stem, Slide }, { scenario, branchingSlide, sortOrder }) => {
  const branchStem = await Stem.create({ scenario: scenario._id, slideRef: branchingSlide.ref, sortOrder });
  const branchSlide = await Slide.create({ scenario: scenario._id, stemRef: branchStem.ref, sortOrder: 0 });
  return { branchStem, branchSlide };
};

const createBranchTrigger = (Trigger, { scenario, branchingSlide, items, defaultStemRef = null }) => Trigger.create({
  scenario: scenario._id,
  elementRef: branchingSlide.ref,
  triggerType: 'SLIDE',
  action: 'BRANCH_TO_STEM_FROM_PROMPTS',
  items,
  defaultStemRef
});

describe('convertTriggersToStemAndSlides (in-memory mongo)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({ models: db.models, close: vi.fn() });
  });

  describe('feedback', () => {

    it('moves a feedback trigger onto its slide and soft-deletes the trigger', async () => {
      const { Trigger, Slide } = db.models;
      const { scenario, rootSlides: [slide] } = await createOldScenario(db.models, { name: 'Feedback', rootSlideCount: 1 });
      const promptRef = new mongoose.Types.ObjectId();

      const trigger = await Trigger.create({
        scenario: scenario._id,
        elementRef: slide.ref,
        triggerType: 'SLIDE',
        action: 'SHOW_FEEDBACK_FROM_PROMPTS',
        shouldGenerateFeedbackFromAI: true,
        items: [{ elementRef: new mongoose.Types.ObjectId(), conditions: [buildCondition(promptRef)] }]
      });

      await convertTriggersToStemAndSlides();

      const updatedSlide = await getDocument(Slide, slide._id);
      const [feedbackItem] = updatedSlide.feedbackItems;

      expect(updatedSlide.hasFeedback).toBe(true);
      expect(updatedSlide.shouldGenerateFeedbackFromAI).toBe(true);
      expect(updatedSlide.feedbackItems).toHaveLength(1);
      expect(String(feedbackItem._id)).toBe(String(trigger.items[0]._id));
      expect(feedbackItem).not.toHaveProperty('elementRef');
      expect(String(feedbackItem.conditions[0].prompts[0].ref)).toBe(String(promptRef));
      expect((await getDocument(Trigger, trigger._id)).isDeleted).toBe(true);
    });

    it('leaves a slide that already has feedback and its trigger alone', async () => {
      const { Trigger, Slide } = db.models;
      const { scenario, rootSlides: [slide] } = await createOldScenario(db.models, { name: 'Has feedback', rootSlideCount: 1 });

      await Slide.updateOne({ _id: slide._id }, { hasFeedback: true, feedbackItems: [] });

      const trigger = await Trigger.create({
        scenario: scenario._id,
        elementRef: slide.ref,
        triggerType: 'SLIDE',
        action: 'SHOW_FEEDBACK_FROM_PROMPTS',
        items: [{ conditions: [] }]
      });

      await convertTriggersToStemAndSlides();

      expect((await getDocument(Slide, slide._id)).feedbackItems).toEqual([]);
      expect((await getDocument(Trigger, trigger._id)).isDeleted).toBe(false);
    });

  });

  describe('branching', () => {

    it('splits the root stem at the branching slide and rejoins every branch into a continuation stem', async () => {
      const { Stem, Slide, Trigger } = db.models;
      const { scenario, rootStem, rootSlides } = await createOldScenario(db.models, { name: 'Rejoin', rootSlideCount: 3 });
      const [firstSlide, branchingSlide, lastSlide] = rootSlides;

      const { branchStem: firstBranchStem } = await createBranchStem(db.models, { scenario, branchingSlide, sortOrder: 0 });
      const { branchStem: secondBranchStem } = await createBranchStem(db.models, { scenario, branchingSlide, sortOrder: 1 });

      const promptRef = new mongoose.Types.ObjectId();
      const trigger = await createBranchTrigger(Trigger, {
        scenario,
        branchingSlide,
        items: [{ elementRef: firstBranchStem.ref, conditions: [buildCondition(promptRef)] }],
        defaultStemRef: secondBranchStem.ref
      });

      await convertTriggersToStemAndSlides();

      const updatedRootStem = await getDocument(Stem, rootStem._id);
      const continuationStem = await Stem.findOne({ scenario: scenario._id, isRoot: false, slideRef: { $exists: false }, _id: { $nin: [firstBranchStem._id, secondBranchStem._id] } }).lean();

      expect(await getStemSlideRefs(Slide, rootStem.ref)).toEqual([String(firstSlide.ref), String(branchingSlide.ref)]);
      expect(await getStemSlideRefs(Slide, continuationStem.ref)).toEqual([String(lastSlide.ref)]);

      expect(getBranchingOptionStemRefs(updatedRootStem)).toEqual([String(firstBranchStem.ref), String(secondBranchStem.ref)]);
      expect(String(updatedRootStem.branchingOptions[0].conditions[0].prompts[0].ref)).toBe(String(promptRef));
      expect(updatedRootStem.branchingOptions[1].conditions).toEqual([]);
      expect(String(updatedRootStem.defaultBranchingStemRef)).toBe(String(secondBranchStem.ref));

      for (const branchStem of [firstBranchStem, secondBranchStem]) {
        const updatedBranchStem = await getDocument(Stem, branchStem._id);
        expect(getBranchingOptionStemRefs(updatedBranchStem)).toEqual([String(continuationStem.ref)]);
        expect(updatedBranchStem).not.toHaveProperty('slideRef');
      }

      expect((await getDocument(Trigger, trigger._id)).isDeleted).toBe(true);
    });

    it('chains a continuation stem for each branching slide in the root stem', async () => {
      const { Stem, Slide } = db.models;
      const { scenario, rootStem, rootSlides } = await createOldScenario(db.models, { name: 'Chain', rootSlideCount: 4 });
      const [firstBranchingSlide, secondSlide, secondBranchingSlide, lastSlide] = rootSlides;

      const { branchStem: firstBranchStem } = await createBranchStem(db.models, { scenario, branchingSlide: firstBranchingSlide, sortOrder: 0 });
      const { branchStem: secondBranchStem } = await createBranchStem(db.models, { scenario, branchingSlide: secondBranchingSlide, sortOrder: 0 });

      await convertTriggersToStemAndSlides();

      const updatedRootStem = await getDocument(Stem, rootStem._id);
      const updatedFirstBranchStem = await getDocument(Stem, firstBranchStem._id);
      const [firstContinuationStemRef] = getBranchingOptionStemRefs(updatedFirstBranchStem);
      const firstContinuationStem = await Stem.findOne({ ref: firstContinuationStemRef }).lean();
      const updatedSecondBranchStem = await getDocument(Stem, secondBranchStem._id);
      const [secondContinuationStemRef] = getBranchingOptionStemRefs(updatedSecondBranchStem);

      expect(await getStemSlideRefs(Slide, rootStem.ref)).toEqual([String(firstBranchingSlide.ref)]);
      expect(getBranchingOptionStemRefs(updatedRootStem)).toEqual([String(firstBranchStem.ref)]);

      expect(await getStemSlideRefs(Slide, firstContinuationStemRef)).toEqual([String(secondSlide.ref), String(secondBranchingSlide.ref)]);
      expect(getBranchingOptionStemRefs(firstContinuationStem)).toEqual([String(secondBranchStem.ref)]);

      expect(await getStemSlideRefs(Slide, secondContinuationStemRef)).toEqual([String(lastSlide.ref)]);
    });

    it('renumbers the slides moved into a continuation stem from 0', async () => {
      const { Stem, Slide } = db.models;
      const { scenario, rootSlides } = await createOldScenario(db.models, { name: 'Sort order', rootSlideCount: 4 });
      const [, branchingSlide] = rootSlides;

      const { branchStem } = await createBranchStem(db.models, { scenario, branchingSlide, sortOrder: 0 });

      await convertTriggersToStemAndSlides();

      const [continuationStemRef] = getBranchingOptionStemRefs(await getDocument(Stem, branchStem._id));
      const continuationSlides = await Slide.find({ stemRef: continuationStemRef }).lean();

      expect(sortBy(map(continuationSlides, 'sortOrder'))).toEqual([0, 1]);
    });

    it('ends the branches without a continuation when the branching slide is the last root slide', async () => {
      const { Stem } = db.models;
      const { scenario, rootStem, rootSlides } = await createOldScenario(db.models, { name: 'Last slide', rootSlideCount: 2 });
      const [, branchingSlide] = rootSlides;

      const { branchStem } = await createBranchStem(db.models, { scenario, branchingSlide, sortOrder: 0 });

      await convertTriggersToStemAndSlides();

      expect(getBranchingOptionStemRefs(await getDocument(Stem, rootStem._id))).toEqual([String(branchStem.ref)]);
      expect((await getDocument(Stem, branchStem._id)).branchingOptions).toEqual([]);
      expect(await Stem.countDocuments({ scenario: scenario._id })).toBe(2);
    });

    it('attaches branch stems with no conditions when the slide has no branching trigger', async () => {
      const { Stem } = db.models;
      const { scenario, rootStem, rootSlides } = await createOldScenario(db.models, { name: 'No trigger', rootSlideCount: 2 });
      const [branchingSlide] = rootSlides;

      const { branchStem } = await createBranchStem(db.models, { scenario, branchingSlide, sortOrder: 0 });

      await convertTriggersToStemAndSlides();

      const updatedRootStem = await getDocument(Stem, rootStem._id);

      expect(getBranchingOptionStemRefs(updatedRootStem)).toEqual([String(branchStem.ref)]);
      expect(updatedRootStem.branchingOptions[0].conditions).toEqual([]);
      expect(updatedRootStem.defaultBranchingStemRef).toBeNull();
    });

    it('skips a scenario whose branching is not one level deep from the root stem', async () => {
      const { Stem, Slide } = db.models;
      const { scenario, rootStem, rootSlides } = await createOldScenario(db.models, { name: 'Nested', rootSlideCount: 2 });
      const [branchingSlide] = rootSlides;

      const { branchStem, branchSlide } = await createBranchStem(db.models, { scenario, branchingSlide, sortOrder: 0 });
      const { branchStem: nestedStem } = await createBranchStem(db.models, { scenario, branchingSlide: branchSlide, sortOrder: 0 });

      await convertTriggersToStemAndSlides();

      expect((await getDocument(Stem, rootStem._id)).branchingOptions).toEqual([]);
      expect(String((await getDocument(Stem, branchStem._id)).slideRef)).toBe(String(branchingSlide.ref));
      expect(String((await getDocument(Stem, nestedStem._id)).slideRef)).toBe(String(branchSlide.ref));
      expect(await getStemSlideRefs(Slide, rootStem.ref)).toEqual(map(rootSlides, (slide) => String(slide.ref)));
    });

    it('makes no changes when run a second time', async () => {
      const { Stem, Slide, Trigger } = db.models;
      const { scenario, rootSlides } = await createOldScenario(db.models, { name: 'Idempotent', rootSlideCount: 3 });
      const [, branchingSlide] = rootSlides;

      const { branchStem } = await createBranchStem(db.models, { scenario, branchingSlide, sortOrder: 0 });
      await createBranchTrigger(Trigger, { scenario, branchingSlide, items: [{ elementRef: branchStem.ref, conditions: [] }] });

      await convertTriggersToStemAndSlides();
      const stemsAfterFirstRun = await Stem.find({}).sort({ _id: 1 }).lean();
      const slidesAfterFirstRun = await Slide.find({}).sort({ _id: 1 }).lean();

      await convertTriggersToStemAndSlides();

      expect(await Stem.find({}).sort({ _id: 1 }).lean()).toEqual(stemsAfterFirstRun);
      expect(await Slide.find({}).sort({ _id: 1 }).lean()).toEqual(slidesAfterFirstRun);
    });

    it('converts published scenarios', async () => {
      const { Published_Scenario, Published_Stem, Published_Slide } = db.models;
      const published = { Scenario: Published_Scenario, Stem: Published_Stem, Slide: Published_Slide };
      const { scenario, rootStem, rootSlides } = await createOldScenario(published, { name: 'Published', rootSlideCount: 2 });
      const [branchingSlide] = rootSlides;

      const { branchStem } = await createBranchStem(published, { scenario, branchingSlide, sortOrder: 0 });

      await convertTriggersToStemAndSlides();

      expect(getBranchingOptionStemRefs(await getDocument(Published_Stem, rootStem._id))).toEqual([String(branchStem.ref)]);
    });

  });

});
