import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(5),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().required().min(5),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
export const updateContactSchemaFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});
export const registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
export const resendVerification = Joi.object({
  email: Joi.string().required(),
});
