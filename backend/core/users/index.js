import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './users.model.js';
import { on, emit } from '#core/events/index.js';
import routes from './users.routes.js';
import getConnection from '#core/databases/helpers/getConnection.js';
import createHash from '#core/authentication/helpers/createHash.js';

registerModel({
  name: 'User',
  model,
  type: 'app'
});

registerRoutes(routes);

on('core:server:started', async function () {

  const connection = getConnection();

  const User = connection.models.User;

  try {
    const user = await User.findOne({ role: 'superAdmin' });
    if (!user) {

      console.log("ADDING USER");

      const superAdmin = {
        firstName: 'Daryl',
        lastName: 'Hedley',
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD,
        role: 'superAdmin',
        isRegistered: true,
        registeredAt: new Date()
      };

      const hash = await createHash(superAdmin.password);

      superAdmin.hash = hash;

      await User.create(superAdmin);

    }
  } catch (error) {
    return console.log('USERS: Error accessing the database', error);
  }
});