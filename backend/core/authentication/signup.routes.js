import Joi from 'joi';
import controller from './signup.controller.js';

export default [{
  route: '/signup',
  controller,
  create: {
    body: {
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required()
    },
  }
}];