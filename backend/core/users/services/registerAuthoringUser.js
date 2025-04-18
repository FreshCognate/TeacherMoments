import uuid from 'node-uuid';

export default async (props, options, context) => {

  const {
    email,
    role
  } = props;
  const { req, models } = context;

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
    registrationId: uuid.v4(),
    registeredAt: createdAt,
  };

  const user = await models.User.create(createObject);

  return user;

};