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
    isVerified: false,
    isDeleted: false
  }).select('+otpCode');

  if (!user) {
    throw { message: 'User not found or already verified', statusCode: 400 };
  }

  // Validate rate limiting
  await validateOtpRateLimit(user, models);

  const now = new Date();
  const windowStart = user.otpRequestWindowStart;
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  let otpRequestCount = user.otpRequestCount || 0;
  let otpRequestWindowStart = user.otpRequestWindowStart;

  // Reset window if expired
  if (!windowStart || windowStart < fifteenMinutesAgo) {
    otpRequestCount = 1;
    otpRequestWindowStart = now;
  } else {
    otpRequestCount += 1;
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();

  await models.User.findByIdAndUpdate(user._id, {
    otpCode,
    otpAttempts: 0,
    otpRequestCount,
    otpRequestWindowStart,
    lastOtpSentAt: now
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
