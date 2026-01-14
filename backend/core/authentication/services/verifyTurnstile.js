
export default async (token, context) => {
  const { req } = context;

  if (process.env.VITE_TURNSTILE_ENABLED === 'false') {
    return { success: true, bypass: true };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    throw {
      message: 'Turnstile secret key not configured',
      statusCode: 500
    };
  }

  if (!token) {
    throw {
      message: 'Turnstile token is required',
      statusCode: 400
    };
  }

  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    console.log(secretKey, token, clientIp);
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: clientIp,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      if (data['error-codes']?.length > 0) {
        console.error('Turnstile verification failed:', data['error-codes']);
      }

      throw {
        message: 'Verification expired or invalid. Please refresh the page and try again.',
        statusCode: 403
      };
    }

    return {
      success: true,
      hostname: data.hostname,
      challengeTs: data.challenge_ts,
      verifiedAt: new Date().toISOString()
    };

  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.error('Turnstile verification error:', error);
    throw {
      message: 'Unable to verify security check. Please try again.',
      statusCode: 500
    };
  }
};
