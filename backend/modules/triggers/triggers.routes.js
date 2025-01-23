import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './triggers.controller.js';
import getTriggerEvents from './helpers/getTriggerEvents.js';
import getTriggerActions from './helpers/getTriggerActions.js';

export default {
  route: '/triggers',
  controller,
  all: {
    query: {
      scenario: Joi.string().required()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  create: {
    body: {
      scenario: Joi.string().required(),
      triggerType: Joi.string().valid('SLIDE'),
      elementRef: Joi.string().required(),
      event: Joi.string().valid(...getTriggerEvents()),
      action: Joi.string().valid(...getTriggerActions()),
      blocks: Joi.array().items(Joi.string())
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  read: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  update: {
    param: 'id',
    body: {
      event: Joi.string().valid(...getTriggerEvents()),
      blocks: Joi.array().items(Joi.string()),
      isDeleted: Joi.boolean().invalid(true),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  }
};