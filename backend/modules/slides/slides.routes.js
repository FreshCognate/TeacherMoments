import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './slides.controller.js';

export default {
  route: '/slides',
  controller,
  all: {
    query: {
      searchValue: Joi.string().allow('').default(''),
      currentPage: Joi.number().default(1),
      slideType: Joi.string(),
      scenarioId: Joi.string().required(),
      isDeleted: Joi.boolean()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  },
  create: {
    body: {
      scenarioId: Joi.string().required(),
      slideId: Joi.string(),
      parentRef: Joi.string(),
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
      slideType: Joi.string().valid('STEP', 'SUMMARY'),
      tags: Joi.array().items(Joi.string()),
      scenarioId: Joi.string(),
      sourceIndex: Joi.number(),
      destinationIndex: Joi.number(),
      isLocked: Joi.boolean(),
      isDeleted: Joi.boolean().invalid(true),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  }
};