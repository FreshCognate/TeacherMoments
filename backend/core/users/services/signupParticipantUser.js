import uuid from 'node-uuid';
import { isEmail } from 'validator';
import crypto from 'crypto';
import createHash from '#core/authentication/helpers/createHash.js';
import sendEmail from '#core/mailer/helpers/sendEmail.js';

export default async (props, options, context) => {

  const {
    username,
    email,
    password,
    confirmPassword
  } = props;

  const { req, models } = context;

  const lowerCaseEmail = email.toLowerCase();

  const isValidEmail = isEmail(email);

  if (username.length < 6) throw { message: 'Username is too short', statusCode: 400 };

  if (!isValidEmail) throw { message: 'Email is now valid', statusCode: 400 };

  if (password !== confirmPassword) throw { message: 'Passwords do not match', statusCode: 400 };

  const isExistingUser = await models.User.findOne({ email: lowerCaseEmail });

  if (isExistingUser) {
    throw { message: 'This user already exists.', statusCode: 400 };
  }

  const createdAt = new Date();

  const hash = await createHash(password);

  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const createObject = {
    username,
    email: lowerCaseEmail,
    role: 'PARTICIPANT',
    hash,
    verificationCode,
    verificationCodeExpiry,
    isVerified: false,
    createdAt,
  };

  const user = await models.User.create(createObject);

  await sendEmail({
    to: 'daryl@freshcognate.com',
    subject: 'Verification',
    htmlBody: `${verificationCode}`,
    textBody: `${verificationCode}`,
  })

  return user;

};