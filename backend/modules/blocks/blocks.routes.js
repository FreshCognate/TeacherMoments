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
      scenarioId: Joi.string(),
      slideRef: Joi.string(),
      isDeleted: Joi.boolean()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  },
  create: {
    body: {
      scenarioId: Joi.string().required(),
      slideRef: Joi.string().required(),
      blockType: Joi.string().required().valid('TEXT', 'IMAGES', 'MEDIA', 'SUGGESTION', 'RESPONSE', 'MULTIPLE_CHOICE_PROMPT', 'INPUT_PROMPT', 'ACTIONS_PROMPT')
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
      sourceIndex: Joi.number(),
      destinationIndex: Joi.number(),
      ...buildLanguageValidation('title', Joi.array()),
      ...buildLanguageValidation('body', Joi.array()),
      ...buildLanguageValidation('placeholder', Joi.string().allow('')),
      isRequired: Joi.boolean(),
      requiredLength: Joi.number(),
      isMultiSelect: Joi.boolean(),
      imagesShape: Joi.string().valid('CIRCLE', 'LANDSCAPE', 'PORTRAIT', 'SQUARE', 'NONE'),
      imagesBorderRadius: Joi.number().valid(0, 8),
      inputType: Joi.string().valid('AUDIO', 'TEXT', 'AUDIO_AND_TEXT'),
      mediaCompleteOn: Joi.string().valid('START', 'END'),
      mediaType: Joi.string().valid('YOUTUBE', 'ASSET'),
      mediaSrc: Joi.string().allow(''),
      responseRef: Joi.string().allow(null),
      suggestionType: Joi.string().valid('INFO', 'WARNING'),
      ...buildLanguageValidation('mediaAsset', [Joi.string().allow(null), Joi.object()]),
      items: Joi.array().items({
        _id: Joi.string(),
        ...buildLanguageValidation('caption', Joi.string().allow('')),
        ...buildLanguageValidation('asset', [Joi.string().allow(null), Joi.object()]),
      }),
      options: Joi.array().items({
        _id: Joi.string(),
        ...buildLanguageValidation('text', Joi.string().allow('')),
        ...buildLanguageValidation('feedback', Joi.array()),
        value: Joi.string().allow(''),
      }),
      actions: Joi.array().items({
        _id: Joi.string(),
        ...buildLanguageValidation('text', Joi.string().allow('')),
        actionType: Joi.string().valid('COMPLETE_SLIDE', 'RESET_SCENARIO'),
        actionValue: Joi.string().allow(''),
      }),
      tags: Joi.array().items(Joi.string()),
      isDeleted: Joi.boolean().invalid(true),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN', 'FACILITATOR'])],
  }
};