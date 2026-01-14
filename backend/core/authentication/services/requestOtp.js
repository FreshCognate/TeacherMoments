import crypto from 'crypto';
import sendEmail from '#core/mailer/helpers/sendEmail.js';
import validateOtpRateLimit from './validateOtpRateLimit.js';

export default async ({ email }, context) => {
  const { models } = context;

  const lowerCaseEmail = email.toLowerCase();

  let user = await models.User.findOne({
    email: lowerCaseEmail,
    isDeleted: false
  }).select('+otpCode');

  if (!user) {
    throw { message: 'User not found', statusCode: 404 };
  }

  await validateOtpRateLimit(user, models);

  const otpCode = crypto.randomInt(100000, 999999).toString();

  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  let otpRequestCount = user.otpRequestCount || 0;

  if (!user.otpGeneratedAt || user.otpGeneratedAt < fifteenMinutesAgo) {
    otpRequestCount = 1;
  } else {
    otpRequestCount += 1;
  }

  await models.User.findByIdAndUpdate(user._id, {
    otpCode,
    otpAttempts: 0,
    otpRequestCount,
    otpGeneratedAt: now
  });

  await sendEmail({
    to: lowerCaseEmail,
    templateAlias: 'login',
    templateModel: {
      name: user.firstName || user.username || 'User',
      otpCode,
      expiryMinutes: 10
    }
  });

  return {
    message: 'OTP sent successfully',
    email: lowerCaseEmail
  };
};
