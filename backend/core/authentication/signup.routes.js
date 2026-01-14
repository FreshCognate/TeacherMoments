import Joi from 'joi';
import controller from './signup.controller.js';

export default [{
  route: '/signup',
  controller,
  create: {
    body: {
      username: Joi.string().min(6).required(),
      email: Joi.string().email().required()
    },
  },
  update: {
    body: {
      email: Joi.string().email().required(),
      otpCode: Joi.string().length(6).required()
    },
  }
}];