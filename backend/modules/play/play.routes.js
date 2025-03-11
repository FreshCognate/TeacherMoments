import Joi from 'joi';
import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
import isAuthenticated from '#core/authentication/middleware/isAuthenticated.js';
import controller from './play.controller.js';
import playSlidesController from './playSlides.controller.js';

export default [{
  route: '/play/slides',
  controller: playSlidesController,
  all: {
    query: {
      scenario: Joi.string().required()
    },
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])]
  },
}, {
  route: '/play',
  controller,
  read: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['SUPER_ADMIN', 'ADMIN'])],
  },
}];