import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './users.model.js';
import { on, emit } from '#core/events/index.js';
import routes from './users.routes.js';
import getConnection from '#core/databases/helpers/getConnection.js';

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
    const user = await User.findOne({ role: 'SUPER_ADMIN' });
    if (!user) {

      console.log("ADDING SUPER ADMIN USER");

      const superAdmin = {
        firstName: 'Daryl',
        lastName: 'Hedley',
        username: process.env.SUPER_ADMIN_EMAIL.split('@')[0],
        email: process.env.SUPER_ADMIN_EMAIL,
        role: 'SUPER_ADMIN',
        isVerified: true,
        registeredAt: new Date(),
        verifiedAt: new Date()
      };

      await User.create(superAdmin);

      console.log("SUPER ADMIN CREATED - Use OTP login to access the account");

    }
  } catch (error) {
    return console.log('USERS: Error accessing the database', error);
  }
});