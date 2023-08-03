import express from "express";
import { contactsController } from "../../controllers/index.js";
import {
  isEmptyBody,
  isValidId,
  authenticate,
} from "../../middlewars/index.js";
import { validateBody } from "../../decorators/index.js";
import { contactAddSchema, contactPatchSchema } from "../../models/contact.js";

const router = express.Router();

router.get("/", authenticate, contactsController.getAll);
router.get("/:contactId", isValidId, contactsController.getById);
router.post(
  "/",
  authenticate,
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsController.add
);
router.put(
  "/:contactId",
  authenticate,
  isEmptyBody,
  isValidId,
  validateBody(contactAddSchema),
  contactsController.updateById
);
router.patch(
  "/:contactId/favorite",
  authenticate,
  isEmptyBody,
  isValidId,
  validateBody(contactPatchSchema),
  contactsController.updateStatusContact
);
router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  contactsController.deleteById
);

export default router;
