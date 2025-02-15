import getBlockPopulate from "../helpers/getBlockPopulate.js";

getBlockPopulate()

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

  const blocks = await models.Block.find(search).sort('sortOrder').populate(getBlockPopulate());

  return {
    blocks
  };

};