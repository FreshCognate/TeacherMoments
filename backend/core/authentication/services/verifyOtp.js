import omit from 'lodash/omit.js';

export default async ({ email, otpCode }, context) => {
  const { req, models } = context;

  const lowerCaseEmail = email.toLowerCase();

  const user = await models.User.findOne({
    email: lowerCaseEmail,
    isDeleted: false
  }).select('+otpCode');

  if (!user) {
    throw { message: 'User not found', statusCode: 404 };
  }

  const now = new Date();
  if (user.isLocked && user.lockedUntil && user.lockedUntil > now) {
    const minutesRemaining = Math.ceil((user.lockedUntil - now) / 1000 / 60);
    throw {
      message: `Account is locked. Please try again in ${minutesRemaining} minute(s).`,
      statusCode: 429
    };
  }

  if (user.isLocked && user.lockedUntil && user.lockedUntil <= now) {
    await models.User.findByIdAndUpdate(user._id, {
      isLocked: false,
      lockedUntil: null,
      lockReason: null,
      otpAttempts: 0
    });
    user.isLocked = false;
    user.otpAttempts = 0;
  }

  if (!user.otpCode || !user.otpGeneratedAt) {
    throw { message: 'No OTP found. Please request a new one.', statusCode: 400 };
  }

  const otpExpiryTime = new Date(user.otpGeneratedAt.getTime() + 10 * 60 * 1000);
  if (now > otpExpiryTime) {
    throw { message: 'OTP has expired. Please request a new one.', statusCode: 400 };
  }

  if (user.otpAttempts >= 5) {
    const lockedUntil = new Date(now.getTime() + 15 * 60 * 1000);
    await models.User.findByIdAndUpdate(user._id, {
      isLocked: true,
      lockedUntil,
      lockReason: 'TOO_MANY_ATTEMPTS',
      otpCode: null
    });
    throw {
      message: 'Too many failed attempts. Account locked for 15 minutes.',
      statusCode: 429
    };
  }

  if (user.otpCode !== otpCode) {
    await models.User.findByIdAndUpdate(user._id, {
      $inc: { otpAttempts: 1 }
    });
    const attemptsRemaining = 5 - (user.otpAttempts + 1);
    throw {
      message: `Invalid OTP. ${attemptsRemaining} attempt(s) remaining.`,
      statusCode: 400
    };
  }

  const updateFields = {
    otpCode: null,
    otpAttempts: 0,
    loggedInAt: now
  };

  if (!user.firstLoggedInAt) {
    updateFields.firstLoggedInAt = now;
  }

  if (!user.isVerified) {
    updateFields.isVerified = true;
    updateFields.verifiedAt = now;
  }

  const updatedUser = await models.User.findByIdAndUpdate(
    user._id,
    updateFields,
    { new: true }
  );

  return new Promise((resolve, reject) => {
    req.logIn(updatedUser, (err) => {
      if (err) {
        return reject({ message: 'Authentication successful but login failed', statusCode: 500 });
      }

      const userObject = omit(updatedUser.toObject(), ['otpCode']);
      resolve(userObject);
    });
  });
};
