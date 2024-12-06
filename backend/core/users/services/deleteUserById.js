export default async (props, options, context) => {

  const { userId } = props;

  const { user, models } = context;
  const deletedUser = await models.User.findByIdAndUpdate(userId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: user._id
  }, { new: true });
  return deletedUser;

};