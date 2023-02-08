const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { salesAdmin } = admin;

router.get("/admin/salesList", salesAdmin.getSalesList);

module.exports = router;
