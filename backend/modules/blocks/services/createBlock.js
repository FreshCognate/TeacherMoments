export default async (props, options, context) => {

  const { scenario, slide, blockType } = props;

  const { models, user } = context;

  const slideBlocks = await models.Block.find({ scenario, slide, isDeleted: false });

  const sortOrder = slideBlocks.length;

  const newBlockObject = {
    scenario,
    slide,
    blockType,
    sortOrder,
    createdBy: user._id,
  };

  const block = await models.Block.create(newBlockObject);

  return block;

};