import '../../backend/modules/scenarios/index.js';
import '../../backend/modules/slides/index.js';
import '../../backend/modules/stems/index.js';
import withConnection from '../../backend/core/databases/helpers/withConnection.js';

export default async () => withConnection(async (connection) => {

  const { models } = connection;

  // await models.Stem.deleteMany({});
  // await models.Published_Stem.deleteMany({});
  // await models.Slide.updateMany({}, { $unset: { stemRef: '' } });
  // await models.Published_Slide.updateMany({}, { $unset: { stemRef: '' } });

  // console.log('Cleaned up existing stems and stemRef references');

  const scenarios = await models.Scenario.find({});
  const publishedScenarios = await models.Published_Scenario.find({});

  console.log(`Found ${scenarios.length} scenarios and ${publishedScenarios.length} published scenarios to process`);

  for (const scenario of scenarios) {

    let rootStem = await models.Stem.findOne({ scenario: scenario._id, isRoot: true });
    let createdStem = false;

    if (!rootStem) {
      rootStem = await models.Stem.create({
        scenario: scenario._id,
        name: 'Stem 1',
        isRoot: true
      });
      createdStem = true;
    }

    const stems = await models.Stem.find({ scenario: scenario._id, isDeleted: false });
    const validStemRefs = stems.map((stem) => stem.ref);

    // Fix slides whose stemRef is missing or points to a stem outside this scenario
    // (left over from a bad duplication) by pointing them at the root stem
    const result = await models.Slide.updateMany(
      { scenario: scenario._id, $or: [{ stemRef: { $exists: false } }, { stemRef: { $nin: validStemRefs } }] },
      { stemRef: rootStem.ref }
    );

    if (createdStem) {
      console.log(`Scenario "${scenario.name}" — created root stem, fixed ${result.modifiedCount} slides`);
    } else {
      console.log(`Scenario "${scenario.name}" — fixed ${result.modifiedCount} slides`);
    }

  }

  for (const scenario of publishedScenarios) {

    // Publish the scenario's draft stems into Published_Stem so the play
    // flow can resolve them (mirrors publishModelByScenarioId)
    await models.Published_Stem.deleteMany({ scenario: scenario._id });

    const draftStems = await models.Stem.find({ scenario: scenario._id, isDeleted: false });
    for (const draftStem of draftStems) {
      await models.Published_Stem.create(draftStem.toJSON());
    }

    let rootStem = draftStems.find((stem) => stem.isRoot);

    // Edge case: a published scenario with no draft stems still needs a root
    if (!rootStem) {
      rootStem = await models.Published_Stem.create({
        scenario: scenario._id,
        name: 'Stem 1',
        isRoot: true
      });
    }

    const result = await models.Published_Slide.updateMany(
      { scenario: scenario._id, stemRef: { $exists: false } },
      { stemRef: rootStem.ref }
    );

    console.log(`Published scenario "${scenario.name}" — published ${draftStems.length} stems, backfilled ${result.modifiedCount} slides`);

  }

  console.log('Upgrade complete');

});
