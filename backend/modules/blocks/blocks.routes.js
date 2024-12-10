import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './blocks.controller.js';
import buildLanguageValidation from '#core/app/helpers/buildLanguageValidation.js';

export default {
  route: '/blocks',
  controller,
  all: {
    query: {
      searchValue: Joi.string().allow('').default(''),
      currentPage: Joi.number().default(1),
      blockType: Joi.string(),
      scenario: Joi.string(),
      slide: Joi.string(),
      isDeleted: Joi.boolean()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  create: {
    body: {
      scenario: Joi.string().required(),
      slide: Joi.string().required(),
      blockType: Joi.string().required().valid('TEXT')
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
      blockType: Joi.string().valid('TEXT', 'INPUT', 'ACTIONS'),
      sourceIndex: Joi.number(),
      destinationIndex: Joi.number(),
      ...buildLanguageValidation('title', Joi.array()),
      ...buildLanguageValidation('body', Joi.array()),
      ...buildLanguageValidation('placeholder', Joi.string()),
      tags: Joi.array().items(Joi.string()),
      isDeleted: Joi.boolean().invalid(true),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  }
};