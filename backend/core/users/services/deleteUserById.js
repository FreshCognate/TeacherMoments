import canCurrentUserManageUser from '#core/authentication/helpers/canCurrentUserManageUser.js';

export default async (props, options, context) => {

  const { userId } = props;

  const { models, user: currentUser } = context;

  const user = await models.User.findById(userId);

  if (!user) {
    throw { message: 'User not found', statusCode: 404 };
  }

  if (!canCurrentUserManageUser({ currentUser, user })) {
    throw { message: "User doesn't have correct permissions", statusCode: 401 };
  }

  const deletedUser = await models.User.findByIdAndUpdate(userId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: currentUser._id
  }, { new: true });

  return deletedUser;

};
