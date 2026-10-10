import hasUserGotPermissions from '#core/authentication/helpers/hasUserGotPermissions.js';
import canCurrentUserManageUser from '#core/authentication/helpers/canCurrentUserManageUser.js';

export default async (props, options, context) => {

  const { userId, update } = props;

  const { models, user: currentUser } = context;

  const updateObject = update;
  // TODO - need to probably have a separate method that registers users rather than checking if user exists
  if (currentUser && !hasUserGotPermissions(currentUser, ['SUPER_ADMIN', 'ADMIN'])) {
    if (userId !== currentUser._id) {
      throw { message: "User doesn't have correct permissions", statusCode: 401 };
    }
  }

  if (updateObject.role === 'SUPER_ADMIN' && (!currentUser || !hasUserGotPermissions(currentUser, ['SUPER_ADMIN']))) {
    throw { message: "User doesn't have correct permissions", statusCode: 401 };
  }

  const user = await models.User.findById(userId);

  if (!user) {
    throw { message: 'User not found', statusCode: 404 };
  }

  if (!canCurrentUserManageUser({ currentUser, user })) {
    throw { message: "User doesn't have correct permissions", statusCode: 401 };
  }

  if (updateObject.email) {
    updateObject.email = updateObject.email.toLowerCase();
    const existingUser = await models.User.findOne({ email: updateObject.email, _id: { $ne: userId } });
    if (existingUser) {
      throw { message: 'A user with this email already exists.', statusCode: 400 };
    }
  }

  updateObject.updatedAt = new Date();
  updateObject.updatedBy = update.userId;

  const updatedUser = await models.User.findByIdAndUpdate(userId, updateObject, { new: true });

  return updatedUser;

};
