import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller, { runController } from './migrations.controller.js';

export default [{
  route: '/migrations/scenarios',
  controller,
  all: {
    query: {
      postgresUrl: Joi.string().required(),
      email: Joi.string().email().allow('').default(''),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN'])],
  }
}, {
  route: '/migrations/scenarios/run',
  controller: runController,
  all: {
    query: {
      postgresUrl: Joi.string().required(),
      scenarioIds: Joi.string().allow('').default(''),
      collaborators: Joi.string().required(),
      dryRun: Joi.boolean().default(true),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN'])],
  }
}];
