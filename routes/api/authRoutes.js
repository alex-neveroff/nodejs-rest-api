import express from "express";
import { validateBody } from "../../decorators/index.js";
import { isEmptyBody, authenticate, upload } from "../../middlewars/index.js";
import {
  loginSchema,
  registerSchema,
  subscriptionSchema,
} from "../../models/users.js";
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

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

router.patch(
  "/",
  authenticate,
  validateBody(subscriptionSchema),
  authController.updateUserSubscription
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

export default router;
