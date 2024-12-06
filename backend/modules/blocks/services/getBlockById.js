export default async (props, options, context) => {

  const { blockId } = props;

  const { models } = context;

  const block = await models.Block.findById(blockId);

  if (!block) throw { message: 'This block does not exist', statusCode: 404 };

  return block;

};