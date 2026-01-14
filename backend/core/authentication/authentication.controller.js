import requestOtp from './services/requestOtp.js';
import verifyOtp from './services/verifyOtp.js';
import verifyTurnstile from './services/verifyTurnstile.js';

export default {

  create: async function ({ body }, context) {
    const { email, turnstileToken } = body;

    if (process.env.TURNSTILE_ENABLED !== 'false') {
      await verifyTurnstile(turnstileToken, context);
    }

    const result = await requestOtp({ email }, context);

    return result;
  },

  update: async function ({ body }, context) {
    const { email, otpCode } = body;

    const authentication = await verifyOtp({ email, otpCode }, context);

    return { authentication };
  },

  read: async function (attributes, { user }) {
    return {
      authentication: user
    };
  },

  delete: async function (attributes, context) {
    const { req, res } = context;

    req.logout(() => {
    });
    res.json({});
  }
};