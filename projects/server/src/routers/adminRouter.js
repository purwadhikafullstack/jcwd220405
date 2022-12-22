const router = require("express").Router();
const { admin } = require("../controllers/index");

router.get("/admin/all_user", admin.allUser);

module.exports = router;
