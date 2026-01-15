export default async ({ tagId, update }, options, context) => {

  const { models, user } = context;

  update.updatedBy = user._id;
  update.updatedAt = new Date();

  const tag = await models.Tag.findByIdAndUpdate(tagId, update, { new: true });

  if (!tag) throw { message: 'This tag does not exist', statusCode: 404 };

  return tag;

};