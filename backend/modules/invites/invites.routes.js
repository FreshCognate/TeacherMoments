import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './invites.controller.js';

export default [{
  route: '/invites',
  controller,
  create: {
    body: {
      inviteId: Joi.string()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'PARTICIPANT'])],
  }
}];