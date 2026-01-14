import crypto from 'crypto';
import sendEmail from '#core/mailer/helpers/sendEmail.js';
import validateOtpRateLimit from '#core/authentication/services/validateOtpRateLimit.js';

export default async (props, options, context) => {

  const {
    email
  } = props;

  const { models } = context;

  const lowerCaseEmail = email.toLowerCase();

  const user = await models.User.findOne({
    email: lowerCaseEmail,
    isVerified: false
  }).select('+otpCode');

  if (!user) {
    throw { message: 'User not found or already verified', statusCode: 400 };
  }

  await validateOtpRateLimit(user, models);

  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  let otpRequestCount = user.otpRequestCount || 0;

  if (!user.otpGeneratedAt || user.otpGeneratedAt < fifteenMinutesAgo) {
    otpRequestCount = 1;
  } else {
    otpRequestCount += 1;
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();

  await models.User.findByIdAndUpdate(user._id, {
    otpCode,
    otpAttempts: 0,
    otpRequestCount,
    otpGeneratedAt: now
  });

  await sendEmail({
    to: lowerCaseEmail,
    templateAlias: 'resend-otp',
    templateModel: {
      name: user.username || 'User',
      otpCode,
      expiryMinutes: 10
    }
  });

  return {
    message: 'OTP sent successfully',
    email: user.email
  };

};
