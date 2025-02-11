import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './assets.controller.js';
import getFileTypes from './helpers/getFileTypes.js';

export default {
  route: '/assets',
  controller,
  create: {
    body: {
      name: Joi.string().required(),
      fileType: Joi.string().required().valid(...getFileTypes())
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
};