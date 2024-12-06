export default async ({ tagId }, context) => {

  const { models, user } = context;

  const update = {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedAt: new Date(),
    updatedBy: user._id
  }

  const tag = await models.Tag.findByIdAndUpdate(tagId, update, { new: true });

  if (!tag) throw { message: 'This tag does not exist', statusCode: 404 };

  return tag;

};