import passport from 'passport';
import createAuthentication from './services/createAuthentication.js';

export default {

  create: async function ({ body }, context) {
    const { email, password } = body;

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