import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(5),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().required().min(5),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
});
export const updateContactSchemaFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});
