export default async (props, options, context) => {

  const { blockId } = props;

  const { models, user } = context;

  const update = {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedAt: new Date(),
    updatedBy: user._id
  }

  const block = await models.Block.findByIdAndUpdate(blockId, update, { new: true });

  if (!block) throw { message: 'This block does not exist', statusCode: 404 };

  return block;

};