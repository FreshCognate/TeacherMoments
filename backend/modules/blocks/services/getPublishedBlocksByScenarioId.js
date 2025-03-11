import getBlockPopulate from "../helpers/getBlockPopulate.js";
import getBlockItemsPopulate from "../helpers/getBlockItemsPopulate.js";

export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  const { models } = context;

  const search = { scenario: scenarioId, isDeleted: false };

  const blocks = await models.Published_Block.find(search).sort('sortOrder').populate(getBlockPopulate()).populate(getBlockItemsPopulate());

  return {
    blocks
  };

};