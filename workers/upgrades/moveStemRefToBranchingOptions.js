import '../../backend/modules/scenarios/index.js';
import '../../backend/modules/stems/index.js';
import withConnection from '../../backend/core/databases/helpers/withConnection.js';
import find from 'lodash/find.js';
import filter from 'lodash/filter.js';
import groupBy from 'lodash/groupBy.js';
import isEqual from 'lodash/isEqual.js';
import map from 'lodash/map.js';
import omit from 'lodash/omit.js';
import some from 'lodash/some.js';
import sortBy from 'lodash/sortBy.js';

// A stem's children used to be found by looking for stems whose `stemRef`
// pointed back at it. Children are now defined by the parent's own
// `branchingOptions`, one entry per child (`branchingOptions[].stemRef`), in
// the order the children are shown. This upgrade builds that list from the
// existing `stemRef` links, which are left in place.
//
// Branching options used to name their stem `elementRef`; kept options are
// rewritten to `stemRef`. Options without a stem (left behind by the old
// `[{}]` default) and options pointing at a stem that is no longer a live
// child are dropped, as they would otherwise read as children.

const makeReport = () => ({
  stemsUpdated: 0,
  linksAdded: 0,
  optionsRemoved: 0,
  defaultsCleared: 0
});

const isSameRef = (refA, refB) => String(refA) === String(refB);

const getBranchingOptionStemRef = (branchingOption) => branchingOption.stemRef || branchingOption.elementRef;

const buildBranchingOptions = ({ stem, childStems }) => {
  const orderedChildStems = sortBy(childStems, ['sortOrder', 'createdAt']);

  return map(orderedChildStems, (childStem) => {
    const existingBranchingOption = find(stem.branchingOptions, (branchingOption) => {
      return isSameRef(getBranchingOptionStemRef(branchingOption), childStem.ref);
    });

    if (!existingBranchingOption) return { stemRef: childStem.ref, conditions: [] };

    return { ...omit(existingBranchingOption, ['elementRef']), stemRef: childStem.ref };
  });
};

const moveStemRefsInScenario = async ({ scenario, Stem, report }) => {
  const stems = await Stem.find({ scenario: scenario._id, isDeleted: false }).lean();

  if (stems.length === 0) return;

  const childStemsByParentRef = groupBy(filter(stems, 'stemRef'), (stem) => String(stem.stemRef));

  let scenarioStemsUpdated = 0;

  for (const stem of stems) {
    const childStems = childStemsByParentRef[String(stem.ref)] || [];
    const branchingOptions = buildBranchingOptions({ stem, childStems });

    const currentBranchingOptions = stem.branchingOptions || [];
    const currentStemRefs = map(currentBranchingOptions, (branchingOption) => String(branchingOption.stemRef));
    const newStemRefs = map(branchingOptions, (branchingOption) => String(branchingOption.stemRef));
    const hasLegacyBranchingOptions = some(currentBranchingOptions, 'elementRef');

    const update = {};

    if (!isEqual(currentStemRefs, newStemRefs) || hasLegacyBranchingOptions) {
      update.branchingOptions = branchingOptions;

      const linksAdded = filter(branchingOptions, (branchingOption) => !branchingOption._id).length;
      report.linksAdded += linksAdded;
      report.optionsRemoved += currentBranchingOptions.length - (branchingOptions.length - linksAdded);
    }

    const hasValidDefault = some(childStems, (childStem) => isSameRef(childStem.ref, stem.defaultBranchingStemRef));

    if (stem.defaultBranchingStemRef && !hasValidDefault) {
      update.defaultBranchingStemRef = null;
      report.defaultsCleared += 1;
    }

    if (Object.keys(update).length === 0) continue;

    await Stem.updateOne({ _id: stem._id }, { $set: update });

    scenarioStemsUpdated += 1;
  }

  if (scenarioStemsUpdated === 0) return;

  report.stemsUpdated += scenarioStemsUpdated;

  console.log(`  "${scenario.name}" (${scenario._id}): updated ${scenarioStemsUpdated} stem(s)`);
};

const moveStemRefs = async ({ models, prefix, report }) => {
  const Scenario = models[`${prefix}Scenario`];
  const Stem = models[`${prefix}Stem`];

  const scenarios = await Scenario.find({}).lean();

  console.log(`Processing ${scenarios.length} ${Scenario.modelName} documents`);

  for (const scenario of scenarios) {
    await moveStemRefsInScenario({ scenario, Stem, report });
  }
};

const logReport = (label, report) => {
  console.log(`${label}: updated ${report.stemsUpdated} stems, added ${report.linksAdded} links, removed ${report.optionsRemoved} options, cleared ${report.defaultsCleared} defaults`);
};

export default async () => withConnection(async (connection) => {

  const { models } = connection;

  const draftReport = makeReport();
  await moveStemRefs({ models, prefix: '', report: draftReport });

  const publishedReport = makeReport();
  await moveStemRefs({ models, prefix: 'Published_', report: publishedReport });

  console.log('---');
  logReport('Scenarios', draftReport);
  logReport('Published scenarios', publishedReport);
  console.log('Upgrade complete');

});
