import Joi from 'joi';

export const registerUser = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

export const loginUser = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).max(16).required(),
});
