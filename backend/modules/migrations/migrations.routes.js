import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './migrations.controller.js';

export default [{
  route: '/migrations/scenarios',
  controller,
  all: {
    query: {
      postgresUrl: Joi.string().required(),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN'])],
  }
}, {
  route: '/migrations',
  controller,
  create: {
    body: {
      postgresUrl: Joi.string().required(),
      scenarioIds: Joi.array().items(Joi.number()).optional(),
      dryRun: Joi.boolean().default(true),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN'])],
  }
}];
