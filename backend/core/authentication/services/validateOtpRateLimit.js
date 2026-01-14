export default async (user, models) => {
  const now = new Date();

  if (user.isLocked && user.lockedUntil && user.lockedUntil > now) {
    const minutesRemaining = Math.ceil((user.lockedUntil - now) / 1000 / 60);
    throw {
      message: `Account is locked due to ${user.lockReason === 'TOO_MANY_ATTEMPTS' ? 'too many failed attempts' : 'too many OTP requests'}. Please try again in ${minutesRemaining} minute(s).`,
      statusCode: 429
    };
  }

  if (user.isLocked && user.lockedUntil && user.lockedUntil <= now) {
    await models.User.findByIdAndUpdate(user._id, {
      isLocked: false,
      lockedUntil: null,
      lockReason: null,
      otpAttempts: 0,
      otpRequestCount: 0
    });
    user.isLocked = false;
    user.otpRequestCount = 0;
  }

  const windowStart = user.otpRequestWindowStart;
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  let requestCount = user.otpRequestCount || 0;

  if (!windowStart || windowStart < fifteenMinutesAgo) {
    requestCount = 0;
  }

  if (requestCount >= 5) {
    const lockedUntil = new Date(now.getTime() + 15 * 60 * 1000);
    await models.User.findByIdAndUpdate(user._id, {
      isLocked: true,
      lockedUntil,
      lockReason: 'TOO_MANY_REQUESTS'
    });
    throw {
      message: 'Too many OTP requests. Account locked for 15 minutes.',
      statusCode: 429
    };
  }

  if (user.lastOtpSentAt) {
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
    if (user.lastOtpSentAt > thirtySecondsAgo) {
      throw {
        message: 'Please wait 30 seconds before requesting another OTP.',
        statusCode: 429
      };
    }
  }

  return true;
};
