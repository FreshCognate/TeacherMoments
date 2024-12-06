export default async (props, options, context) => {

  const {
    scenarioId,
    slideId,
  } = props;

  let {
    isDeleted = false
  } = options;

  const { models } = context;

  const search = { scenario: scenarioId, slide: slideId, isDeleted };

  const blocks = await models.Block.find(search).sort('sortOrder');

  return {
    blocks
  };

};