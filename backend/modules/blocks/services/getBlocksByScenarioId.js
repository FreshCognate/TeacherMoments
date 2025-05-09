import getBlockPopulate from "../helpers/getBlockPopulate.js";
import getBlockItemsPopulate from "../helpers/getBlockItemsPopulate.js";
import checkHasAccessToScenario from "../../scenarios/helpers/checkHasAccessToScenario.js";

export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  let {
    isDeleted = false
  } = options;

  const { models } = context;

  const search = { scenario: scenarioId, isDeleted };

  const blocks = await models.Block.find(search).sort('sortOrder').populate(getBlockPopulate()).populate(getBlockItemsPopulate());

  return {
    blocks
  };

};