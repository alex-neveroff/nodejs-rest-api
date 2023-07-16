import express from "express";
import { contactsController } from "../../controllers/index.js";
import { contactAddSchema, isEmptyBody } from "../../helpers/index.js";
import { validateBody } from "../../decorators/index.js";

const router = express.Router();

router.get("/", contactsController.getAll);
router.get("/:contactId", contactsController.getById);
router.post(
  "/",
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsController.add
);
router.put(
  "/:contactId",
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsController.updateById
);
router.delete("/:contactId", contactsController.deleteById);

export default router;
