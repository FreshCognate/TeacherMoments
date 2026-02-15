import Joi from 'joi';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './responses.controller.js';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';

export default [{
  route: '/responses',
  controller: controller,
  all: {
    query: {
      cohortId: Joi.string(),
      scenarioId: Joi.string(),
      userId: Joi.string(),
      searchValue: Joi.string().allow('').default(''),
      currentPage: Joi.number().default(1)
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])]
  },
}];