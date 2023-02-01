const router = require("express").Router();
const { admin } = require("../../controllers");
const { stocksComp } = admin;

router.post("/admin/add_stocks", stocksComp.addStocks);
router.patch("/admin/edit_stocks", stocksComp.editStocks);

module.exports = router;
