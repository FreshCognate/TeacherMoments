import hasUserGotPermissions from '#core/authentication/helpers/hasUserGotPermissions.js';
import canCurrentUserManageUser from '#core/authentication/helpers/canCurrentUserManageUser.js';

export default async (props, options, context) => {

  const { userId } = props;

  const { models, user: currentUser } = context;

  // TODO - need to probably have a separate method that registers users rather than checking if user exists
  if (currentUser && !hasUserGotPermissions(currentUser, ['SUPER_ADMIN', 'ADMIN'])) {
    if (userId !== currentUser._id) {
      throw { message: "User doesn't have correct permissions", statusCode: 401 };
    }
  }

  const user = await models.User.findById(userId);

  if (!user) {
    throw { message: 'User not found', statusCode: 404 };
  }

  if (!canCurrentUserManageUser({ currentUser, user })) {
    throw { message: "User doesn't have correct permissions", statusCode: 401 };
  }

  const updateObject = {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedBy: currentUser._id,
    updatedAt: new Date()
  };

  const updatedUser = await models.User.findByIdAndUpdate(userId, updateObject, { new: true });

  return updatedUser;

};
