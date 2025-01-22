import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './generate.controller.js';

export default {
  route: '/generate',
  controller,
  create: {
    body: {
      generateType: Joi.string().valid('NAVIGATE_FROM_PROMPTS', 'GIVE_FEEDBACK_FROM_PROMPTS'),
      prompts: Joi.array(),
      stem: Joi.string().allow(''),
      answerText: Joi.string(),
      answerValue: Joi.string(),
      feedbackItems: Joi.array().items({
        _id: Joi.string(),
        text: Joi.string(),
        value: Joi.string()
      }),
      actions: Joi.array(),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
};