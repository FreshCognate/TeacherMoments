import omit from 'lodash/omit.js';
import duplicateSlides from '../../slides/services/duplicateSlides.js';
import checkHasAccessToScenario from '../helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models, user, connection } = context;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  const existingScenario = await models.Scenario.findById(scenarioId);

  if (!existingScenario) throw { message: "This scenario does not exist", statusCode: 404 };

  let newScenario;

  await connection.transaction(async (session) => {

    const duplicatedScenarioObject = omit(existingScenario, ['_id']);
    duplicatedScenarioObject.name = duplicatedScenarioObject.name + " - Duplicate";
    duplicatedScenarioObject.originalScenario = existingScenario._id;
    duplicatedScenarioObject.createdAt = new Date();
    duplicatedScenarioObject.createdBy = user._id;
    duplicatedScenarioObject.hasChanges = true;

    const bulkScenarios = await models.Scenario.create([duplicatedScenarioObject], { session });
    newScenario = bulkScenarios[0];

    const duplicatedSlides = await duplicateSlides({ scenarioId: existingScenario._id, newScenarioId: newScenario._id }, { ...context, session })

    // Need to adjust slide children based upon their originalRef
    for (const duplicatedSlide of duplicatedSlides) {
      await models.Slide.updateMany({ scenario: newScenario._id, children: duplicatedSlide.originalRef }, { $set: { 'children.$': duplicatedSlide.ref } }, { session });
    }

  }).catch(err => {
    console.log(err);
    throw { message: "Failed to duplicate scenario", statusCode: 500 };
  });

  return newScenario;

};