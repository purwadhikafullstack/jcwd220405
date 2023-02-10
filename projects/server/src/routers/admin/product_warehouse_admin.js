const router = require("express").Router();
const { admin } = require("../../controllers");
const { checkAuth } = require("../../middlewares/checkAuth");
const { stocksComp } = admin;

router.post("/admin/add_stocks", checkAuth, stocksComp.addStocks);
router.patch("/admin/edit_stocks", checkAuth, stocksComp.editStocks);

module.exports = router;
