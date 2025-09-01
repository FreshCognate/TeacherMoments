import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './generate.controller.js';

export default {
  route: '/generate',
  controller,
  create: {
    body: {
      generateType: Joi.string().valid('USER_INPUT_PROMPT_MATCHES_CONDITION_PROMPT'),
      userText: Joi.string(),
      promptText: Joi.string()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
};