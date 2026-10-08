import hasUserGotPermissions from '#core/authentication/helpers/hasUserGotPermissions.js';

export default async (props, options, context) => {

  const {
    email,
    role
  } = props;
  const { models, user } = context;

  if (role === 'SUPER_ADMIN' && (!user || !hasUserGotPermissions(user, ['SUPER_ADMIN']))) {
    throw { message: "User doesn't have correct permissions", statusCode: 401 };
  }

  const lowerCaseEmail = email.toLowerCase();

  const isExistingUser = await models.User.findOne({ email: lowerCaseEmail });

  if (isExistingUser) {
    throw { message: 'This user already exists.', statusCode: 400 };
  }

  const createdAt = new Date();

  const createObject = {
    email: lowerCaseEmail,
    role,
    createdAt,
    registeredAt: createdAt,
  };

  const createdUser = await models.User.create(createObject);

  return createdUser;

};