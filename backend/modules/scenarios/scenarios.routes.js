import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './scenarios.controller.js';
import buildLanguageValidation from '#core/app/helpers/buildLanguageValidation.js';

export default {
  route: '/scenarios',
  controller,
  all: {
    query: {
      searchValue: Joi.string().allow('').default(''),
      currentPage: Joi.number().default(1),
      isDeleted: Joi.boolean()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  create: {
    body: {
      name: Joi.string().required(),
      accessType: Joi.string().required().valid("PUBLIC", "PRIVATE"),
      tags: Joi.array().items(Joi.string())
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
      name: Joi.string(),
      ...buildLanguageValidation('title', Joi.string().allow('')),
      ...buildLanguageValidation('description', Joi.array()),
      accessType: Joi.string().valid("PUBLIC", "PRIVATE"),
      tags: Joi.array().items(Joi.string()),
      collaborators: Joi.array().items({
        user: Joi.string().required(),
        role: Joi.string().required().valid('AUTHOR', 'OWNER')
      }),
      isDeleted: Joi.boolean().invalid(true),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  }
};