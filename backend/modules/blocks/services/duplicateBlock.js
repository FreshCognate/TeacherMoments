import omit from 'lodash/omit.js';
import checkHasAccessToScenario from "../../scenarios/helpers/checkHasAccessToScenario.js";

export default async ({ blockId, newScenarioId, newSlideRef }, context) => {
  const { models, session } = context;

  await checkHasAccessToScenario({ modelId: blockId, modelType: 'Block' }, context);

  const block = await models.Block.findById(blockId);

  const duplicatedBlockObject = omit(block, ['_id', 'ref']);

  duplicatedBlockObject.scenario = newScenarioId;
  duplicatedBlockObject.slideRef = newSlideRef;
  duplicatedBlockObject.originalRef = block.ref;
  duplicatedBlockObject.originalSlideRef = block.slideRef;
  duplicatedBlockObject.originalScenario = block.scenario;
  duplicatedBlockObject.createdAt = new Date();

  await models.Block.create([duplicatedBlockObject], { session });

}