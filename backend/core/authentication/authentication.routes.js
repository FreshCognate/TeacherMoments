import Joi from 'joi';
import controller from './authentication.controller.js';
import isAuthenticated from './middleware/isAuthenticated.js';

export default [{
  route: '/authentication',
  controller,
  create: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      turnstileToken: Joi.string().when('$VITE_TURNSTILE_ENABLED', {
        is: 'true',
        then: Joi.required(),
        otherwise: Joi.optional()
      })
    },
    rateLimit: 5,
  },
  read: {
    middleware: [isAuthenticated],
  },
  delete: {
    middleware: [isAuthenticated],
  }
}];