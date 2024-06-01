import path from "node:path";
import crypto from "node:crypto";

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    console.log({ extname });
    const basename = path.basename(file.originalname, extname);
    console.log({ basename });
    const suffix = crypto.randomUUID();

    const filename = `${basename}--${suffix}${extname}`;

    cb(null, filename);
  },
});

export default multer({ storage });
