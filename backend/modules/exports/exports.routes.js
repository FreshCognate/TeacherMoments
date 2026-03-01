import Joi from 'joi';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import controller from './exports.controller.js';

export default [{
  route: '/exports',
  controller,
  create: {
    body: {
      exportType: Joi.string().valid(
        'SCENARIO_RESPONSES',
        'COHORT_SCENARIO',
        'COHORT_USER',
        'COHORT_ALL',
        'USER_HISTORY'
      ).required(),
      scenarioId: Joi.string(),
      cohortId: Joi.string(),
      userId: Joi.string()
    },
    middleware: [isAuthenticated]
  },
  read: {
    param: 'id',
    middleware: [isAuthenticated]
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated]
  }
}];
