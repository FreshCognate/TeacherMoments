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
      slideRef: Joi.string(),
      isDeleted: Joi.boolean()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
  create: {
    body: {
      scenario: Joi.string().required(),
      slideRef: Joi.string().required(),
      blockType: Joi.string().required().valid('TEXT', 'ANSWERS_PROMPT', 'INPUT_PROMPT')
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
      blockType: Joi.string().valid('TEXT', 'ANSWERS_PROMPT', 'ACTIONS'),
      sourceIndex: Joi.number(),
      destinationIndex: Joi.number(),
      ...buildLanguageValidation('title', Joi.array()),
      ...buildLanguageValidation('body', Joi.array()),
      ...buildLanguageValidation('placeholder', Joi.string()),
      isMultiSelect: Joi.boolean(),
      options: Joi.array().items({
        _id: Joi.string(),
        ...buildLanguageValidation('text', Joi.string().allow('')),
        ...buildLanguageValidation('feedback', Joi.array()),
        value: Joi.string(),
      }),
      feedbackItems: Joi.array().items({
        _id: Joi.string(),
        ...buildLanguageValidation('text', Joi.string().allow('')),
        value: Joi.string(),
      }),
      actions: Joi.array().items({
        _id: Joi.string(),
        ...buildLanguageValidation('text', Joi.string().allow('')),
        slideRef: Joi.string(),
        context: Joi.array(),
      }),
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