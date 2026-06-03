import omit from 'lodash/omit.js';

export default async ({ scenarioId, newScenarioId }, context) => {

  const { models, session } = context;

  const stems = await models.Stem.find({ scenario: scenarioId, isDeleted: false });

  const duplicatedStems = [];

  for (const stem of stems) {
    const duplicatedStemObject = omit(stem, ['_id', 'ref']);
    duplicatedStemObject.scenario = newScenarioId;
    duplicatedStemObject.originalRef = stem.ref;
    duplicatedStemObject.originalScenario = stem.scenario;
    duplicatedStemObject.createdAt = new Date();

    const bulkStems = await models.Stem.create([duplicatedStemObject], { session });
    duplicatedStems.push(bulkStems[0]);
  }

  return duplicatedStems;

};
