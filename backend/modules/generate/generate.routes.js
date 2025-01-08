import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './generate.controller.js';

export default {
  route: '/generate',
  controller,
  create: {
    body: {
      generateType: Joi.string().valid('NAVIGATE_BY_PROMPTS'),
      prompts: Joi.array(),
      actions: Joi.array(),
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
};