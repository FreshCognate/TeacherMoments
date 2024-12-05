import has from 'lodash/has.js';
import hasUserGotPermissions from '#core/authentication/helpers/hasUserGotPermissions.js';

export default async ({ userId, update }, context) => {

  const { models, user } = context;

  const updateObject = update;
  // TODO - need to probably have a separate method that registers users rather than checking if user exists
  if (user && !hasUserGotPermissions(user, ['superAdmin', 'admin'])) {
    if (userId !== user._id) {
      throw { message: "User doesn't have correct permissions", statusCode: 401 };
    }
  }

  updateObject.updatedAt = new Date();
  updateObject.updatedBy = update.userId;

  const updatedUser = await models.User.findByIdAndUpdate(userId, updateObject, { new: true });

  return updatedUser;

};