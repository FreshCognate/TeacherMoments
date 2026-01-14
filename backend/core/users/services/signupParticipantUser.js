import validator from 'validator';
import crypto from 'crypto';
import sendEmail from '#core/mailer/helpers/sendEmail.js';

export default async (props, options, context) => {

  const {
    username,
    email
  } = props;

  const { req, models } = context;

  const lowerCaseEmail = email.toLowerCase();

  const isValidEmail = validator.isEmail(email);

  if (username.length < 6) throw { message: 'Username must be at least 6 characters', statusCode: 400 };

  if (!isValidEmail) throw { message: 'Email is not valid', statusCode: 400 };

  const isExistingUser = await models.User.findOne({
    $or: [
      { email: lowerCaseEmail },
      { username }
    ]
  });

  if (isExistingUser) {
    throw { message: 'This user already exists. Try another username or email.', statusCode: 400 };
  }

  const createdAt = new Date();

  const otpCode = crypto.randomInt(100000, 999999).toString();

  const createObject = {
    username,
    email: lowerCaseEmail,
    role: 'PARTICIPANT',
    otpCode,
    otpAttempts: 0,
    otpRequestCount: 1,
    otpGeneratedAt: createdAt,
    isVerified: false,
    createdAt,
  };

  const user = await models.User.create(createObject);

  await sendEmail({
    to: lowerCaseEmail,
    templateAlias: 'signup',
    templateModel: {
      name: username,
      otpCode,
      expiryMinutes: 10
    }
  });

  return { user };

};