import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './triggers.controller.js';

export default {
  route: '/triggers',
  controller,
  all: {
    query: {
      searchValue: Joi.string().allow('').default(''),
      currentPage: Joi.number().default(1)
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  create: {
    body: {
      scenario: Joi.string().required(),
      triggerType: Joi.string().valid('SLIDE', 'BLOCK'),
      elementRef: Joi.string().required(),
      event: Joi.string().valid('ON_INIT', 'ON_SHOW')
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
      event: Joi.string().valid('ON_INIT', 'ON_SHOW'),
      isDeleted: Joi.boolean().invalid(true),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  }
};