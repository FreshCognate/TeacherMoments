import passport from 'passport';
import omit from 'lodash/omit.js';

export default async ({ email, password }, context) => {
  if (!email) {
    throw { statusCode: 401, message: "Invalid username or password" };
  }

  const { req, res } = context;

  const authenticate = (req, res) => {

    return new Promise((resolve, reject) => {

      passport.authenticate('local', async function (err, user, info) {

        if (err) { return reject(err); }

        if (!user) {
          return reject({ statusCode: 401, message: "Invalid username or password" });
        }

        if (!user.firstLoggedInAt) {
          user.firstLoggedInAt = new Date();
        }

        user.loggedInAt = new Date();

        await user.save();

        const userModel = omit(user.toObject(), ['hash']);

        req.logIn(user, async function (err) {

          if (err) return reject({ statusCode: 401, message: "Invalid username or password" });

          return resolve({ user: userModel });

        });

      })(req, res, resolve);
    });

  };

  const result = await authenticate(req, res);

  return result.user;
}