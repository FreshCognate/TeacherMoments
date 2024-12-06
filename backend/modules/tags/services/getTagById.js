export default async ({ tagId }, context) => {

  const { models } = context;

  const tag = await models.Tag.findOneById(tagId);

  if (!tag) throw { message: 'This tag does not exist', statusCode: 404 };

  return tag;

};