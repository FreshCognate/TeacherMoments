export default async (props, options, context) => {

  const { scenario, slide, blockType } = props;

  const { models, user } = context;

  const newBlockObject = {
    scenario,
    slide,
    blockType,
    createdBy: user._id,
  };

  const block = await models.Block.create(newBlockObject);

  return block;

};