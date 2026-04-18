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

    const existingStem = await models.Stem.findOne({ scenario: scenario._id });

    if (existingStem) {
      console.log(`Scenario "${scenario.name}" — already has a stem, skipping`);
      continue;
    }

    const stem = await models.Stem.create({
      scenario: scenario._id,
      name: 'Stem 1',
      isRoot: true
    });

    const result = await models.Slide.updateMany(
      { scenario: scenario._id, stemRef: { $exists: false } },
      { stemRef: stem.ref }
    );

    console.log(`Scenario "${scenario.name}" — created stem, updated ${result.modifiedCount} slides`);

  }

  for (const scenario of publishedScenarios) {

    const existingStem = await models.Published_Stem.findOne({ scenario: scenario._id });

    if (existingStem) {
      console.log(`Published scenario "${scenario.name}" — already has a stem, skipping`);
      continue;
    }

    const stem = await models.Published_Stem.create({
      scenario: scenario._id,
      name: 'Stem 1',
      isRoot: true
    });

    const result = await models.Published_Slide.updateMany(
      { scenario: scenario._id, stemRef: { $exists: false } },
      { stemRef: stem.ref }
    );

    console.log(`Published scenario "${scenario.name}" — created stem, updated ${result.modifiedCount} slides`);

  }

  console.log('Upgrade complete');

};
