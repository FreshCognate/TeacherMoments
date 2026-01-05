export default async (props, options, context) => {

  const {
    userId,
    code,
  } = props;

  const { req, models } = context;

  if (!userId || !code) {
    throw { message: 'User ID and verification code are required', statusCode: 400 };
  }

  const user = await models.User.findOne({
    _id: userId,
    isVerified: false
  }).select('+verificationCode +verificationCodeExpiry');

  if (!user) {
    throw { message: 'User not found or already verified', statusCode: 404 };
  }

  if (!user.verificationCodeExpiry || new Date() > user.verificationCodeExpiry) {
    throw { message: 'Verification code has expired', statusCode: 400 };
  }

  if (user.verificationAttempts >= 5) {
    throw { message: 'Too many verification attempts. Please request a new code.', statusCode: 429 };
  }

  if (user.verificationCode !== code) {
    await models.User.findByIdAndUpdate(userId, {
      $inc: { verificationAttempts: 1 }
    });
    throw { message: 'Invalid verification code', statusCode: 400 };
  }

  const verifiedAt = new Date();
  const verifiedUser = await models.User.findByIdAndUpdate(userId, {
    isVerified: true,
    verifiedAt,
    verificationCode: null,
    verificationCodeExpiry: null,
    verificationAttempts: 0,
    firstLoggedInAt: new Date(),
    loggedInAt: new Date()
  }, { new: true });

  return new Promise((resolve, reject) => {
    req.logIn(verifiedUser, (err) => {
      if (err) {
        return reject({ message: 'Verification successful but login failed', statusCode: 500 });
      }
      resolve({
        success: true,
        message: 'User verified and logged in successfully',
        userId: verifiedUser._id
      });
    });
  });

};