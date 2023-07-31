import multer from "multer";
import path from "path";

const tmpDir = path.resolve("tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  fileName: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multerConfig });

export default upload;
