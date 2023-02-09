const router = require("express").Router();

const { userProfile } = require("../controllers");

const { uploadProfileUser } = require("../helpers/multer");

router.get("/user/:id", userProfile.getOne);
router.patch("/user/settings/:id", userProfile.settingsProfile);
router.post("/user/check/:id", userProfile.checkPassword);
router.post("/user/send-otp/:id", userProfile.sendOtp);
router.post("/user/sign-otp/:id", userProfile.signOtp);
router.patch("/user/setting/email/:id", userProfile.settingEmail);
router.patch("/user/setting/password/:id", userProfile.settingPassword);
router.post(
  "/user-upload/:id",
  uploadProfileUser.single("image"),
  userProfile.uploadPicture
);

module.exports = router;
