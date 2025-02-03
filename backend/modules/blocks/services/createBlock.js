export default async (props, options, context) => {

  const { scenario, slideRef, blockType } = props;

  const { models, user } = context;

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

  return block;

};