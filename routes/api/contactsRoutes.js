import express from "express";
import { contactsController } from "../../controllers/index.js";
import { isEmptyBody, isValidId } from "../../helpers/index.js";
import { validateBody } from "../../decorators/index.js";
import { contactAddSchema, contactPatchSchema } from "../../models/contact.js";

const router = express.Router();

router.get("/", contactsController.getAll);
router.get("/:contactId", isValidId, contactsController.getById);
router.post(
  "/",
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsController.add
);
router.put(
  "/:contactId",
  isEmptyBody,
  isValidId,
  validateBody(contactAddSchema),
  contactsController.updateById
);
router.patch(
  "/:contactId/favorite",
  isEmptyBody,
  isValidId,
  validateBody(contactPatchSchema),
  contactsController.updateStatusContact
);
router.delete("/:contactId", isValidId, contactsController.deleteById);

export default router;
