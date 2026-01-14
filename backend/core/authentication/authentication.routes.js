import Joi from 'joi';
import controller from './authentication.controller.js';
import isAuthenticated from './middleware/isAuthenticated.js';

export default [{
  route: '/authentication',
  controller,
  create: {
    body: {
      email: Joi.string().email().required(),
      turnstileToken: Joi.string().when('$TURNSTILE_ENABLED', {
        is: 'true',
        then: Joi.required(),
        otherwise: Joi.optional()
      })
    },
    rateLimit: 5,
  },
  update: {
    body: {
      email: Joi.string().email().required(),
      otpCode: Joi.string().length(6).required()
    },
    rateLimit: 10,
  },
  read: {
    middleware: [isAuthenticated],
  },
  delete: {
    middleware: [isAuthenticated],
  }
}];