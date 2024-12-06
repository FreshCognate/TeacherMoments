export default async (props, options, context) => {

  const { tagId } = props;

  const { models } = context;

  const tag = await models.Tag.findById(tagId);

  if (!tag) throw { message: 'This tag does not exist', statusCode: 404 };

  return tag;

};