import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(5),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().required().min(5),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});
