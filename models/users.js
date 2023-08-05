import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError, validateAtUpdate } from "../middlewars/index.js";

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
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("findOneAndUpdate", handleMongooseError);
userSchema.post("save", handleMongooseError);

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Missing required email field",
    "string.base": "Field email must be a string",
    "string.email": "Field email not valid",
  }),
  password: Joi.string().required().messages({
    "any.required": "Missing required password field",
    "string.base": "Field password must be a string",
  }),
  subscription: Joi.string().valid(...subscriptionList),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Missing required email field",
    "string.base": "Field email must be a string",
    "string.email": "Field email not valid",
  }),
  password: Joi.string().required().messages({
    "any.required": "Missing required password field",
    "string.base": "Field password must be a string",
  }),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required()
    .messages({
      "any.only": "Field subscription must be one of {{#valids}}",
    }),
});

export const verificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Missing required field email",
    "string.base": "Field email must be a string",
    "string.email": "Field email not valid",
  }),
});

export const User = model("user", userSchema);
