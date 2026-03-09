import omit from 'lodash/omit.js';
import duplicateSlides from '../../slides/services/duplicateSlides.js';
import duplicateTriggers from '../../triggers/services/duplicateTriggers.js';
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
    duplicatedScenarioObject.collaborators = [{ user: user._id, role: 'OWNER' }];
    duplicatedScenarioObject.cohorts = [];
    duplicatedScenarioObject.hasChanges = true;
    duplicatedScenarioObject.isPublished = false;
    duplicatedScenarioObject.publishLink = null;
    duplicatedScenarioObject.publishedAt = null;
    duplicatedScenarioObject.publishedBy = null;

    const bulkScenarios = await models.Scenario.create([duplicatedScenarioObject], { session });
    newScenario = bulkScenarios[0];

    const duplicatedSlides = await duplicateSlides({ scenarioId: existingScenario._id, newScenarioId: newScenario._id }, { ...context, session })

    for (const duplicatedSlide of duplicatedSlides) {
      await models.Slide.updateMany({ scenario: newScenario._id, children: duplicatedSlide.originalRef }, { $set: { 'children.$': duplicatedSlide.ref } }, { session });
    }

    // Build ref maps for triggers
    const slideRefMap = new Map();
    for (const duplicatedSlide of duplicatedSlides) {
      slideRefMap.set(duplicatedSlide.originalRef.toString(), duplicatedSlide.ref);
    }

    const newBlocks = await models.Block.find({ scenario: newScenario._id }, null, { session });
    const blockRefMap = new Map();
    for (const block of newBlocks) {
      if (block.originalRef) {
        blockRefMap.set(block.originalRef.toString(), block.ref);
      }
    }

    await duplicateTriggers({ scenarioId: existingScenario._id, newScenarioId: newScenario._id, slideRefMap, blockRefMap }, { ...context, session });

  }).catch(err => {
    console.log(err);
    throw { message: "Failed to duplicate scenario", statusCode: 500 };
  });

  return newScenario;

};