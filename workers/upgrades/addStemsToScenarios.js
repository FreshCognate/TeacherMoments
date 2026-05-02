import '../../backend/modules/scenarios/index.js';
import '../../backend/modules/slides/index.js';
import '../../backend/modules/stems/index.js';
import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';

export default async () => {

  const { models } = await connectDatabase();

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

    const result = await models.Slide.updateMany(
      { scenario: scenario._id, stemRef: { $exists: false } },
      { stemRef: rootStem.ref }
    );

    if (createdStem) {
      console.log(`Scenario "${scenario.name}" — created root stem, backfilled ${result.modifiedCount} slides`);
    } else {
      console.log(`Scenario "${scenario.name}" — backfilled ${result.modifiedCount} slides`);
    }

  }

  for (const scenario of publishedScenarios) {

    let rootStem = await models.Published_Stem.findOne({ scenario: scenario._id, isRoot: true });
    let createdStem = false;

    if (!rootStem) {
      rootStem = await models.Published_Stem.create({
        scenario: scenario._id,
        name: 'Stem 1',
        isRoot: true
      });
      createdStem = true;
    }

    const result = await models.Published_Slide.updateMany(
      { scenario: scenario._id, stemRef: { $exists: false } },
      { stemRef: rootStem.ref }
    );

    if (createdStem) {
      console.log(`Published scenario "${scenario.name}" — created root stem, backfilled ${result.modifiedCount} slides`);
    } else {
      console.log(`Published scenario "${scenario.name}" — backfilled ${result.modifiedCount} slides`);
    }

  }

  console.log('Upgrade complete');

};
