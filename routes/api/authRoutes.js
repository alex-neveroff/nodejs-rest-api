import express from "express";
import { validateBody } from "../../decorators/index.js";
import { isEmptyBody, isValidId } from "../../helpers/index.js";
import { loginSchema, registerSchema } from "../../models/users.js";
import { authController } from "../../controllers/index.js";
const router = express.Router();

router.post(
  "/register",
  isEmptyBody,
  validateBody(registerSchema),
  authController.register
);

router.post(
  "/login",
  isEmptyBody,
  validateBody(loginSchema),
  authController.login
);

export default router;
