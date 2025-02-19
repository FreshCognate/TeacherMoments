import getBlockPopulate from "../helpers/getBlockPopulate.js";
import getBlockItemsPopulate from "../helpers/getBlockItemsPopulate.js";

export default async (props, options, context) => {

  const {
    scenarioId,
    slideRef,
  } = props;

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