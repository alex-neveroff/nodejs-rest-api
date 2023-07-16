import Joi from "joi";

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
    "string.base": "field name must be a string",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
    "string.base": "field email must be a string",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field",
    "string.base": "field phone must be a string",
  }),
});

export default contactAddSchema;
