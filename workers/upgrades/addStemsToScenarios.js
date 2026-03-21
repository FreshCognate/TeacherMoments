import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';

export default async () => {

  const { models } = await connectDatabase();

  const scenarios = await models.Scenario.find({});
  const publishedScenarios = await models.Published_Scenario.find({});

  console.log(`Found ${scenarios.length} scenarios and ${publishedScenarios.length} published scenarios to process`);

  for (const scenario of scenarios) {

    const stem = await models.Stem.create({
      scenario: scenario._id,
      name: 'Stem 1',
      isRoot: true
    });

    const result = await models.Slide.updateMany(
      { scenario: scenario._id, stem: { $exists: false } },
      { stem: stem.ref }
    );

    console.log(`Scenario "${scenario.name}" — created stem, updated ${result.modifiedCount} slides`);

  }

  for (const scenario of publishedScenarios) {

    const stem = await models.Published_Stem.create({
      scenario: scenario._id,
      name: 'Stem 1',
      isRoot: true
    });

    const result = await models.Published_Slide.updateMany(
      { scenario: scenario._id, stem: { $exists: false } },
      { stem: stem.ref }
    );

    console.log(`Published scenario "${scenario.name}" — created stem, updated ${result.modifiedCount} slides`);

  }

  console.log('Upgrade complete');

};
