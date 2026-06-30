import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './stems.controller.js';

export default {
  route: '/stems',
  controller,
  all: {
    query: {
      scenarioId: Joi.string().required(),
      isDeleted: Joi.boolean()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  },
  create: {
    body: {
      scenarioId: Joi.string().required(),
      stemRef: Joi.string(),
      slideRef: Joi.string(),
      sortOrder: Joi.number(),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  },
  read: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  },
  update: {
    param: 'id',
    body: {
      name: Joi.string().allow(''),
      description: Joi.array()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  }
};
