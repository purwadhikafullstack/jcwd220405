const router = require("express").Router();
const { user } = require("../controllers/index");

router.post("/user/register", user.register);
router.get("/user/verification", user.verification);
router.post("/user/setpass", user.setpass);

module.exports = router;
