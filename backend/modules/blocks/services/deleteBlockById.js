export default async (props, options, context) => {

  const { blockId } = props;

  const { models, user } = context;

  const block = await models.Block.findByIdAndUpdate(blockId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: user._id
  }, { new: true });

  if (!block) throw { message: 'This block does not exist', statusCode: 404 };

  return block;

};