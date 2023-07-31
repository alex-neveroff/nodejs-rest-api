import { User } from "../models/users.js";
import { HttpError } from "../middlewars/index.js";
import { controllerWrapper } from "../decorators/index.js";
import bcript from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";

dotenv.config();
const { JWT_SECRET } = process.env;
const avatarsDir = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcript.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparePassword = await bcript.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "48h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
};

const updateUserSubscription = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });
  res.json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.resolve(avatarsDir, fileName);

  const resizedAvatar = await Jimp.read(tmpUpload);
  resizedAvatar.cover(250, 250);
  resizedAvatar.writeAsync(tmpUpload);

  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.resolve(avatarsDir, fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getCurrent: controllerWrapper(getCurrent),
  logout: controllerWrapper(logout),
  updateUserSubscription: controllerWrapper(updateUserSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
};
