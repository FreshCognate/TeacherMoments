import has from 'lodash/has.js';
import hasUserGotPermissions from '#core/authentication/helpers/hasUserGotPermissions.js';

export default async ({ userId }, context) => {

  const { models, user } = context;

  // TODO - need to probably have a separate method that registers users rather than checking if user exists
  if (user && !hasUserGotPermissions(user, ['SUPER_ADMIN', 'ADMIN'])) {
    if (userId !== user._id) {
      throw { message: "User doesn't have correct permissions", statusCode: 401 };
    }
  }

  const updateObject = {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedBy: user._id,
    updatedAt: new Date()
  };

  const updatedUser = await models.User.findByIdAndUpdate(userId, updateObject, { new: true });

  return updatedUser;

};