import { isValidObjectId } from "mongoose";
import { HttpError } from "./index.js";

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(HttpError(404, "Not found"));
    // Як альтернатива:
    // next(HttpError(400, `${contactId} isn't valid id`));
  }
  next();
};

export default isValidId;
