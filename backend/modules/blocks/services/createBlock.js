import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

export default async (props, options, context) => {

  const { scenario, slideRef, blockType } = props;

  const { models, user } = context;

  await checkHasAccessToScenario({ modelId: scenario, modelType: 'Scenario' }, context);

  const slideBlocks = await models.Block.find({ scenario, slideRef, isDeleted: false });

  const sortOrder = slideBlocks.length;

  const newBlockObject = {
    scenario,
    slideRef,
    blockType,
    sortOrder,
    createdBy: user._id,
  };

  const block = await models.Block.create(newBlockObject);

  setScenarioHasChanges({ scenarioId: scenario }, {}, context);

  return block;

};