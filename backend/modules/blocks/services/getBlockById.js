import getBlockPopulate from "../helpers/getBlockPopulate.js";
import getBlockItemsPopulate from "../helpers/getBlockItemsPopulate.js";
import checkHasAccessToScenario from "../../scenarios/helpers/checkHasAccessToScenario.js";

export default async (props, options, context) => {

  const { blockId } = props;

  const { models } = context;

  await checkHasAccessToScenario({ modelId: blockId, modelType: 'Block' }, context);

  const block = await models.Block.findById(blockId).populate(getBlockPopulate()).populate(getBlockItemsPopulate());

  if (!block) throw { message: 'This block does not exist', statusCode: 404 };

  return block;

};