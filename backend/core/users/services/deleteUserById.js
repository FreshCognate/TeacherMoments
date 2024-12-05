export default async ({ userId }, context) => {

  const { user, models } = context;
  const deletedUser = await models.User.findByIdAndUpdate(userId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: user._id
  }, { new: true });
  return deletedUser;

};