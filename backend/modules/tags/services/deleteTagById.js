export default async ({ tagId }, context) => {

  const { models, user } = context;

  const tag = await models.Tag.findByIdAndUpdate(tagId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: user._id
  }, { new: true });

  if (!tag) throw { message: 'This tag does not exist', statusCode: 404 };

  return tag;

};