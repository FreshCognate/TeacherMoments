import '../../backend/modules/scenarios/index.js';
import '../../backend/modules/slides/index.js';
import '../../backend/modules/stems/index.js';
import '../../backend/modules/blocks/index.js';
import '../../backend/modules/triggers/index.js';
import withConnection from '../../backend/core/databases/helpers/withConnection.js';
import find from 'lodash/find.js';
import filter from 'lodash/filter.js';
import map from 'lodash/map.js';

// Deleting a slide used to leave the stems branching off it behind, along with
// every slide, block and trigger inside them. Those rows stay `isDeleted: false`
// so they are still returned by the API and still copied on publish, but nothing
// can reach them: the editor only draws a stem underneath its parent slide, and
// the player walks down from the root stem. This upgrade soft-deletes whatever
// that walk can no longer reach.
//
// A scenario is skipped and reported rather than cleaned when it has no root
// stem, or when a slide has no stemRef at all — in both cases everything looks
// unreachable, and deleting a whole scenario is not recoverable.

const makeReport = () => ({
  scenariosCleaned: 0,
  stemsRemoved: 0,
  slidesRemoved: 0,
  blocksRemoved: 0,
  triggersRemoved: 0,
  skipped: 0
});

const getReachableRefs = ({ stems, slides }) => {
  const rootStem = find(stems, { isRoot: true });

  if (!rootStem) return null;

  const reachableStemRefs = new Set();
  const reachableSlideRefs = new Set();
  const stemsToVisit = [rootStem];

  while (stemsToVisit.length > 0) {
    const stem = stemsToVisit.shift();
    const stemRef = String(stem.ref);

    if (reachableStemRefs.has(stemRef)) continue;
    reachableStemRefs.add(stemRef);

    const stemSlides = filter(slides, (slide) => String(slide.stemRef) === stemRef);

    for (const stemSlide of stemSlides) {
      const slideRef = String(stemSlide.ref);
      reachableSlideRefs.add(slideRef);
      stemsToVisit.push(...filter(stems, (childStem) => String(childStem.slideRef) === slideRef));
    }
  }

  return { reachableStemRefs, reachableSlideRefs };
};

const removeOrphansFromScenario = async ({ scenario, Stem, Slide, Block, Trigger, report }) => {
  const stems = await Stem.find({ scenario: scenario._id, isDeleted: false }).lean();
  const slides = await Slide.find({ scenario: scenario._id, isDeleted: false }).lean();

  if (stems.length === 0 && slides.length === 0) return;

  const slidesWithoutStem = filter(slides, (slide) => !slide.stemRef);

  if (slidesWithoutStem.length > 0) {
    report.skipped += 1;
    console.log(`  ⚠️  "${scenario.name}" (${scenario._id}): ${slidesWithoutStem.length} slide(s) have no stemRef, left as-is`);
    return;
  }

  const reachable = getReachableRefs({ stems, slides });

  if (!reachable) {
    report.skipped += 1;
    console.log(`  ⚠️  "${scenario.name}" (${scenario._id}): no root stem, left as-is`);
    return;
  }

  const orphanedStems = filter(stems, (stem) => !reachable.reachableStemRefs.has(String(stem.ref)));
  const orphanedSlides = filter(slides, (slide) => !reachable.reachableSlideRefs.has(String(slide.ref)));

  if (orphanedStems.length === 0 && orphanedSlides.length === 0) return;

  const deletedAt = new Date();
  const orphanedSlideRefs = map(orphanedSlides, 'ref');

  await Stem.updateMany({ _id: { $in: map(orphanedStems, '_id') } }, { isDeleted: true, deletedAt });
  await Slide.updateMany({ _id: { $in: map(orphanedSlides, '_id') } }, { isDeleted: true, deletedAt });

  const blockResult = await Block.updateMany({ slideRef: { $in: orphanedSlideRefs }, isDeleted: false }, { isDeleted: true, deletedAt });
  const triggerResult = await Trigger.updateMany({ elementRef: { $in: orphanedSlideRefs }, isDeleted: false }, { isDeleted: true, deletedAt });

  report.scenariosCleaned += 1;
  report.stemsRemoved += orphanedStems.length;
  report.slidesRemoved += orphanedSlides.length;
  report.blocksRemoved += blockResult.modifiedCount;
  report.triggersRemoved += triggerResult.modifiedCount;

  console.log(`  "${scenario.name}" (${scenario._id}): removed ${orphanedStems.length} stem(s), ${orphanedSlides.length} slide(s), ${blockResult.modifiedCount} block(s), ${triggerResult.modifiedCount} trigger(s)`);
};

const removeOrphans = async ({ models, prefix, report }) => {
  const Scenario = models[`${prefix}Scenario`];
  const Stem = models[`${prefix}Stem`];
  const Slide = models[`${prefix}Slide`];
  const Block = models[`${prefix}Block`];
  const Trigger = models[`${prefix}Trigger`];

  const scenarios = await Scenario.find({}).lean();

  console.log(`Processing ${scenarios.length} ${Scenario.modelName} documents`);

  for (const scenario of scenarios) {
    await removeOrphansFromScenario({ scenario, Stem, Slide, Block, Trigger, report });
  }
};

const logReport = (label, report) => {
  console.log(`${label}: cleaned ${report.scenariosCleaned} scenarios, removed ${report.stemsRemoved} stems, ${report.slidesRemoved} slides, ${report.blocksRemoved} blocks, ${report.triggersRemoved} triggers, skipped ${report.skipped}`);
};

export default async () => withConnection(async (connection) => {

  const { models } = connection;

  const draftReport = makeReport();
  await removeOrphans({ models, prefix: '', report: draftReport });

  const publishedReport = makeReport();
  await removeOrphans({ models, prefix: 'Published_', report: publishedReport });

  console.log('---');
  logReport('Scenarios', draftReport);
  logReport('Published scenarios', publishedReport);
  console.log('Upgrade complete');

});
