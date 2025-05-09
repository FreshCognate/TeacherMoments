import getBlockPopulate from "../helpers/getBlockPopulate.js";
import getBlockItemsPopulate from "../helpers/getBlockItemsPopulate.js";
import checkHasAccessToScenario from "../../scenarios/helpers/checkHasAccessToScenario.js";

export default async (props, options, context) => {

  const {
    scenarioId,
    slideRef,
  } = props;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  let {
    isDeleted = false
  } = options;

  const { models } = context;

  const search = { scenario: scenarioId, slideRef: slideRef, isDeleted };

  const blocks = await models.Block.find(search).sort('sortOrder').populate(getBlockPopulate()).populate(getBlockItemsPopulate());

  return {
    blocks
  };

};