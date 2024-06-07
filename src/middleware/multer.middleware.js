const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    // cb(null, file.originalname);
    const fileExtensionName = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExtensionName, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now() +
      fileExtensionName;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = upload;
