import omit from 'lodash/omit.js';
import getModelsAndTenant from '#core/databases/helpers/getModelsAndTenant.js';

export default function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (req, id, done) {

    const deserialize = async function () {
      const { models } = await getModelsAndTenant(req);

      try {
        let user = await models.User.findById(id);

        if (!user) return done('No user');
        user = omit(user.toObject(), ['otpCode']);
        done(null, user);

      } catch (error) {
        return done(error);

      }

    };

    deserialize();

  });

};