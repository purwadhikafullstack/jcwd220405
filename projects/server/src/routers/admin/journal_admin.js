const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { journalComp } = admin;
const { checkAuth } = require("../../middlewares/checkAuth");

router.get("/admin/all_journal", checkAuth, journalComp.allJournal);
router.get("/admin/warehouse_journal", checkAuth, journalComp.warehouseJournal);

module.exports = router;
