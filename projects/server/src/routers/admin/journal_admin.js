const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { journalComp } = admin;

router.get("/admin/all_journal", journalComp.allJournal);

module.exports = router;
