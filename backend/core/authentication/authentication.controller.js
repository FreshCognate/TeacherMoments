import passport from 'passport';
import createAuthentication from './services/createAuthentication.js';
import verifyTurnstile from './services/verifyTurnstile.js';

export default {

  create: async function ({ body }, context) {
    const { email, password, turnstileToken } = body;

    if (process.env.VITE_TURNSTILE_ENABLED !== 'false') {
      await verifyTurnstile(turnstileToken, context);
    }

    const authentication = await createAuthentication({ email, password }, context);

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