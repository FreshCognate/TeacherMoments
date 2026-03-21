import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './upgrades.controller.js';

export default {
  route: '/upgrades',
  controller,
  read: {
    param: 'upgradeFile',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN'])],
  }
};
