export default async (props, options, context) => {

  const {
    email,
    verificationCode
  } = props;

  const { models } = context;

  const lowerCaseEmail = email.toLowerCase();

  const user = await models.User.findOne({
    email: lowerCaseEmail,
    isVerified: false
  }).select('+verificationCode +verificationCodeExpiry');

  if (!user) {
    throw { message: 'User not found or already verified', statusCode: 400 };
  }

  if (new Date() > user.verificationCodeExpiry) {
    throw { message: 'Verification code has expired', statusCode: 400 };
  }

  if (user.verificationAttempts >= 5) {
    throw { message: 'Too many verification attempts. Please request a new code.', statusCode: 429 };
  }

  if (user.verificationCode !== verificationCode) {
    await models.User.findByIdAndUpdate(user._id, { $inc: { verificationAttempts: 1 } });
    throw { message: 'Invalid verification code', statusCode: 400 };
  }

  const verifiedAt = new Date();
  const verifiedUser = await models.User.findByIdAndUpdate(user._id, {
    isVerified: true,
    verifiedAt,
    verificationCode: null,
    verificationCodeExpiry: null,
    verificationAttempts: 0
  }, { new: true });

  return verifiedUser;

};
