import getModelsAndTenant from '#core/databases/helpers/getModelsAndTenant.js';
import compareInputWithHash from '#core/authentication/helpers/compareInputWithHash.js';

export default async (req, user, callback) => {
  try {
    const email = user.email.toLowerCase();
    const password = user.password;

    const { models } = await getModelsAndTenant(req);

    const currentUser = await models.User.findOne({ email, isDeleted: false }).select('email hash firstLoggedInAt');

    if (!currentUser) throw { message: "This user doesn't exist", statusCode: 401 };
    // Test no email of that user

    if (!currentUser.hash) {
      throw { message: "This user hasn't signed up", statusCode: 401 };
    }

    const hasMatchedHash = await compareInputWithHash(password, currentUser.hash);

    if (hasMatchedHash) {
      return callback(null, currentUser);
    }

    throw { statusCode: 401, message: "Invalid username or password" };

  } catch (error) {
    if (!error.statusCode) {
      // eslint-disable-next-line n/no-callback-literal
      return callback({ statusCode: 500, message: error.message });
    }
    return callback(error);
  }
};