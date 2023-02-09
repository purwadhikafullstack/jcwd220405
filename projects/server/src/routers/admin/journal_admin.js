const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { journalComp } = admin;
const { checkAuth } = require("../../middlewares/checkAuth");

router.get("/admin/all_journal", journalComp.allJournal);
router.get("/admin/warehouse_journal", journalComp.warehouseJournal);

module.exports = router;
