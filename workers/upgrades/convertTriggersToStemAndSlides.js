import '../../backend/modules/scenarios/index.js';
import '../../backend/modules/slides/index.js';
import '../../backend/modules/stems/index.js';
import '../../backend/modules/triggers/index.js';
import withConnection from '../../backend/core/databases/helpers/withConnection.js';
import filter from 'lodash/filter.js';
import find from 'lodash/find.js';
import findIndex from 'lodash/findIndex.js';
import flatMap from 'lodash/flatMap.js';
import groupBy from 'lodash/groupBy.js';
import map from 'lodash/map.js';
import omit from 'lodash/omit.js';
import some from 'lodash/some.js';
import sortBy from 'lodash/sortBy.js';

const makeReport = () => ({
  scenariosConverted: 0,
  feedbackConverted: 0,
  branchingSlidesConverted: 0,
  continuationStemsCreated: 0,
  triggersDeleted: 0,
  skipped: 0
});

const isSameRef = (refA, refB) => String(refA) === String(refB);

const softDeleteTriggers = async ({ Trigger, triggers, report }) => {
  if (triggers.length === 0) return;
  await Trigger.updateMany({ _id: { $in: map(triggers, '_id') } }, { isDeleted: true, deletedAt: new Date() });
  report.triggersDeleted += triggers.length;
};

const convertFeedback = async ({ slides, triggers, Slide, Trigger, report }) => {
  const feedbackTriggers = filter(triggers, { action: 'SHOW_FEEDBACK_FROM_PROMPTS' });
  const convertedTriggers = [];

  for (const trigger of feedbackTriggers) {
    const slide = find(slides, (slide) => isSameRef(slide.ref, trigger.elementRef));

    if (!slide || slide.hasFeedback) continue;

    await Slide.updateOne({ _id: slide._id }, {
      $set: {
        hasFeedback: true,
        shouldGenerateFeedbackFromAI: trigger.shouldGenerateFeedbackFromAI,
        feedbackItems: map(trigger.items, (item) => omit(item, ['elementRef']))
      }
    });

    convertedTriggers.push(trigger);
  }

  report.feedbackConverted += convertedTriggers.length;
  await softDeleteTriggers({ Trigger, triggers: convertedTriggers, report });

  return convertedTriggers.length;
};

const getOldBranchStems = (stems) => {
  const linkedStemRefs = flatMap(stems, (stem) => map(stem.branchingOptions, (branchingOption) => String(branchingOption.stemRef)));

  return filter(stems, (stem) => {
    return !stem.isRoot && stem.slideRef && !linkedStemRefs.includes(String(stem.ref));
  });
};

const buildBranchingOptions = ({ branchStems, branchTrigger }) => {
  return map(sortBy(branchStems, ['sortOrder', 'createdAt']), (branchStem) => {
    const triggerItem = find(branchTrigger?.items, (item) => isSameRef(item.elementRef, branchStem.ref));
    if (!triggerItem) return { stemRef: branchStem.ref, conditions: [] };
    return { ...omit(triggerItem, ['elementRef']), stemRef: branchStem.ref };
  });
};

const convertBranching = async ({ scenario, stems, slides, triggers, Stem, Slide, Trigger, report }) => {
  const oldBranchStems = getOldBranchStems(stems);

  if (oldBranchStems.length === 0) return 0;

  const rootStem = find(stems, { isRoot: true });
  const rootSlides = sortBy(filter(slides, (slide) => isSameRef(slide.stemRef, rootStem?.ref)), 'sortOrder');
  const branchStemsBySlideRef = groupBy(oldBranchStems, (stem) => String(stem.slideRef));

  const hasUnsupportedBranching = !rootStem
    || some(rootStem.branchingOptions, 'stemRef')
    || some(Object.keys(branchStemsBySlideRef), (slideRef) => !find(rootSlides, (slide) => isSameRef(slide.ref, slideRef)));

  if (hasUnsupportedBranching) {
    report.skipped += 1;
    console.log(`  ⚠️  "${scenario.name}" (${scenario._id}): branching is not one level deep from the root stem, left as-is`);
    return 0;
  }

  const branchingSlides = filter(rootSlides, (slide) => branchStemsBySlideRef[String(slide.ref)]);
  const convertedTriggers = [];

  let parentStem = rootStem;
  let stemCount = stems.length;

  for (const [branchingIndex, branchingSlide] of branchingSlides.entries()) {
    const nextBranchingSlide = branchingSlides[branchingIndex + 1];
    const startIndex = findIndex(rootSlides, (slide) => isSameRef(slide.ref, branchingSlide.ref)) + 1;
    const endIndex = nextBranchingSlide
      ? findIndex(rootSlides, (slide) => isSameRef(slide.ref, nextBranchingSlide.ref)) + 1
      : rootSlides.length;
    const continuationSlides = rootSlides.slice(startIndex, endIndex);

    const branchStems = branchStemsBySlideRef[String(branchingSlide.ref)];
    const branchTrigger = find(triggers, (trigger) => {
      return trigger.action === 'BRANCH_TO_STEM_FROM_PROMPTS' && isSameRef(trigger.elementRef, branchingSlide.ref);
    });

    let continuationStem = null;

    if (continuationSlides.length > 0) {
      stemCount += 1;
      continuationStem = await Stem.create({ scenario: scenario._id, name: `Stem ${stemCount}` });
      report.continuationStemsCreated += 1;

      for (const [sortOrder, continuationSlide] of continuationSlides.entries()) {
        await Slide.updateOne({ _id: continuationSlide._id }, { $set: { stemRef: continuationStem.ref, sortOrder } });
      }
    }

    const hasDefaultBranchStem = some(branchStems, (branchStem) => isSameRef(branchStem.ref, branchTrigger?.defaultStemRef));

    await Stem.updateOne({ _id: parentStem._id }, {
      $set: {
        branchingOptions: buildBranchingOptions({ branchStems, branchTrigger }),
        defaultBranchingStemRef: hasDefaultBranchStem ? branchTrigger.defaultStemRef : null
      }
    });

    await Stem.updateMany({ _id: { $in: map(branchStems, '_id') } }, {
      $set: { branchingOptions: continuationStem ? [{ stemRef: continuationStem.ref, conditions: [] }] : [] },
      $unset: { slideRef: '' }
    });

    if (branchTrigger) convertedTriggers.push(branchTrigger);
    report.branchingSlidesConverted += 1;

    if (!continuationStem) break;
    parentStem = continuationStem;
  }

  await softDeleteTriggers({ Trigger, triggers: convertedTriggers, report });

  return branchingSlides.length;
};

const convertScenario = async ({ scenario, Stem, Slide, Trigger, report }) => {
  const stems = await Stem.find({ scenario: scenario._id, isDeleted: false }).lean();
  const slides = await Slide.find({ scenario: scenario._id, isDeleted: false }).lean();
  const triggers = await Trigger.find({ scenario: scenario._id, isDeleted: false }).lean();

  const feedbackCount = await convertFeedback({ slides, triggers, Slide, Trigger, report });
  const branchingCount = await convertBranching({ scenario, stems, slides, triggers, Stem, Slide, Trigger, report });

  if (feedbackCount === 0 && branchingCount === 0) return;

  report.scenariosConverted += 1;

  console.log(`  "${scenario.name}" (${scenario._id}): converted ${feedbackCount} feedback trigger(s), ${branchingCount} branching slide(s)`);
};

const convertTriggers = async ({ models, prefix, report }) => {
  const Scenario = models[`${prefix}Scenario`];
  const Stem = models[`${prefix}Stem`];
  const Slide = models[`${prefix}Slide`];
  const Trigger = models[`${prefix}Trigger`];

  const scenarios = await Scenario.find({}).lean();

  console.log(`Processing ${scenarios.length} ${Scenario.modelName} documents`);

  for (const scenario of scenarios) {
    await convertScenario({ scenario, Stem, Slide, Trigger, report });
  }
};

const logReport = (label, report) => {
  console.log(`${label}: converted ${report.scenariosConverted} scenarios, ${report.feedbackConverted} feedback triggers, ${report.branchingSlidesConverted} branching slides, created ${report.continuationStemsCreated} continuation stems, deleted ${report.triggersDeleted} triggers, skipped ${report.skipped}`);
};

export default async () => withConnection(async (connection) => {

  const { models } = connection;

  const draftReport = makeReport();
  await convertTriggers({ models, prefix: '', report: draftReport });

  const publishedReport = makeReport();
  await convertTriggers({ models, prefix: 'Published_', report: publishedReport });

  console.log('---');
  logReport('Scenarios', draftReport);
  logReport('Published scenarios', publishedReport);
  console.log('Upgrade complete');

});
