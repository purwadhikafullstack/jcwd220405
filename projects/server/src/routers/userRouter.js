const router = require("express").Router();
const { user } = require("../controllers/index");
const { tokenVerifier } = require("../middlewares/tokenVerifier");

router.post("/user/register", user.register);
router.get("/user/verification", user.verification);
router.post("/user/setpass", user.setpass);
router.post("/user/login", user.login);
router.get("/user/keeplogin", tokenVerifier, user.keeplogin);
router.post("/user/emailresetpass", user.emailResetPass);
router.post("/user/resetpassword", user.resetpassword);

module.exports = router;
