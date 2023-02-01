const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { mutationComp } = admin;

router.get("/admin/all_mutations", mutationComp.allMutation);
router.post("/admin/add_mutation", mutationComp.addMutation);
router.patch("/admin/approval_mutation/:id", mutationComp.approvalMutation)

module.exports = router;
