import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError, validateAtUpdate } from "../helpers/index.js";

const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
    "string.base": "field email must be a string",
    "string.email": "field email not valid",
  }),
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
    "string.base": "field password must be a string",
  }),
  subscription: Joi.string().valid(...subscriptionList),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
    "string.base": "field email must be a string",
    "string.email": "field email not valid",
  }),
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
    "string.base": "field password must be a string",
  }),
});

export const User = model("user", userSchema);
