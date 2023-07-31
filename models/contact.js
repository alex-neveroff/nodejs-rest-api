import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError, validateAtUpdate } from "../middlewars/index.js";

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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Missing required name field",
    "string.base": "Field name must be a string",
  }),
  email: Joi.string().required().messages({
    "any.required": "Missing required email field",
    "string.base": "Field email must be a string",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Missing required phone field",
    "string.base": "Field phone must be a string",
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
