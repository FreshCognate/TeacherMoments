import crypto from 'crypto';

export default async (props, options, context) => {

  const {
    email
  } = props;

  const { models } = context;

  const lowerCaseEmail = email.toLowerCase();

  const user = await models.User.findOne({
    email: lowerCaseEmail,
    isVerified: false
  }).select('+verificationCodeExpiry');

  if (!user) {
    throw { message: 'User not found or already verified', statusCode: 400 };
  }

  if (user.verificationCodeExpiry) {
    const lastSentAt = new Date(user.verificationCodeExpiry.getTime() - 15 * 60 * 1000);
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    if (lastSentAt > oneMinuteAgo) {
      throw {
        message: 'Please wait before requesting a new code',
        statusCode: 429
      };
    }
  }

  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await models.User.findByIdAndUpdate(user._id, {
    verificationCode,
    verificationCodeExpiry,
    verificationAttempts: 0
  });

  // TODO: Send verification email with verificationCode
  // Example: await sendVerificationEmail(user.email, verificationCode);

  return {
    message: 'Verification code sent successfully',
    email: user.email
  };

};
