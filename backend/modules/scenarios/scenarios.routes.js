import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './scenarios.controller.js';
import scenarioCollaboratorsController from './scenarioCollaborators.controller.js';
import buildLanguageValidation from '#core/app/helpers/buildLanguageValidation.js';

export default [{
  route: '/scenarioCollaborators',
  controller: scenarioCollaboratorsController,
  all: {
    query: {
      searchValue: Joi.string().allow('').default(''),
      currentPage: Joi.number().default(1),
      scenarioId: Joi.string().required(),
      isDeleted: Joi.boolean()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  update: {
    body: {
      scenarioId: Joi.string().optional(),
      setType: Joi.string().valid("ADD", "REMOVE"),
      collaborators: Joi.array().items(Joi.string()),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
}, {
  route: '/scenarios',
  controller,
  all: {
    query: {
      searchValue: Joi.string().allow('').default(''),
      currentPage: Joi.number().default(1),
      accessType: Joi.string().allow('').default(''),
      sortBy: Joi.string().valid('NAME', 'NEWEST', 'OLDEST').default('NAME'),
      isDeleted: Joi.boolean()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  create: {
    body: {
      name: Joi.string().when('scenarioId', { is: Joi.string(), then: Joi.optional(), otherwise: Joi.required() }),
      accessType: Joi.string().when('scenarioId', { is: Joi.string(), then: Joi.optional(), otherwise: Joi.required().valid("PUBLIC", "PRIVATE") }),
      scenarioId: Joi.string().optional(),
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
      ...buildLanguageValidation('consent', Joi.array()),
      ...buildLanguageValidation('summary', Joi.array()),
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
}];