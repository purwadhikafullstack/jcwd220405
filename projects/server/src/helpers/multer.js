const multer = require("multer");
const path = require("path");

const storageProfileUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/profile"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "M-PROFILE" +
        "-" +
        new Date().getFullYear() +
        Math.round(Math.random() * 6789012) +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const uploadProfileUser = multer({
  storage: storageProfileUser,
  limits: { fileSize: 1028576 },
  fileFilter(req, file, cb) {
    const passEXT = [".jpg", ".jpeg", ".png"];
    const extProfile = path.extname(file.originalname).toLowerCase();

    if (!passEXT.includes(extProfile)) {
      const error = new Error("Please upload image file (jpg, jpeg, png)");
      return cb(error);
    }
    cb(null, true);
  },
});

const storagePaymentProof = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, path.join(__dirname, "../public/payment"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "M-PAYMENT" +
        "-" +
        new Date().getFullYear() +
        Math.round(Math.random() * 6789012) +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const uploadPaymentProof = multer({
  storage: storagePaymentProof,
  limits: { fileSize: 1028576 },
  fileFilter(req, file, cb) {
    const passEXT = [".jpg", ".jpeg", ".png"];
    const extPayment = path.extname(file.originalname).toLocaleLowerCase();

    if (!passEXT.includes(extPayment)) {
      const error = new Error("Please upload image file (jpg, jpeg, png)");
      return cb(error);
    }
    cb(null, true);
  },
});

module.exports = { uploadProfileUser, uploadPaymentProof };
