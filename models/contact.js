import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError, validateAtUpdate } from "../helpers/index.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

export const contactAddSchema = Joi.object({
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
  favorite: Joi.boolean(),
});

export const contactPatchSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

contactSchema.pre("findOneAndUpdate", validateAtUpdate);

contactSchema.post("findOneAndUpdate", handleMongooseError);
contactSchema.post("save", handleMongooseError);

export const Contact = model("contact", contactSchema);
