import Joi from 'joi';
import controller from './users.controller.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import languages from '../../../config/languages.json' with { type: "json" };

export default [{
  route: '/users',
  controller,
  all: {
    query: {
      searchValue: Joi.string().allow('').default(''),
      currentPage: Joi.number().default(1),
      isDeleted: Joi.boolean()
    },
    //middleware: [isAuthenticated, hasPermissions(['superAdmin', 'admin'])],
    middleware: []
  },
  create: {
    body: {
      emails: Joi.array().items(Joi.string().email({ minDomainSegments: 2 })).min(1).required(),
      role: Joi.string().allow('admin', 'editor', 'reviewer', 'user').default('user').required(),
    },
    middleware: [isAuthenticated, hasPermissions(['superAdmin', 'admin'])],
  },
  read: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['superAdmin', 'admin'])],
  },
  update: {
    param: 'id',
    body: {
      firstName: Joi.string(),
      lastName: Joi.string(),
      externalReference: Joi.string(),
      role: Joi.string().allow('admin', 'editor', 'reviewer', 'user').default('user'),
      selectedLanguage: Joi.string().allow(...Object.keys(languages)),
      isDeleted: Joi.boolean().invalid(true),
    },
    middleware: [isAuthenticated, hasPermissions(['superAdmin', 'admin'])],
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['superAdmin', 'admin'])],
  }
}];