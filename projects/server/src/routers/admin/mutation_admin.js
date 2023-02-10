const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { checkAuth } = require("../../middlewares/checkAuth");
const { mutationComp } = admin;

router.get("/admin/all_mutations", checkAuth, mutationComp.allMutation);
router.post("/admin/add_mutation", checkAuth, mutationComp.addMutation);
router.patch("/admin/approval_mutation/:id", checkAuth, mutationComp.approvalMutation);
router.delete("/admin/delete_mutation", checkAuth, mutationComp.deleteMutation);

module.exports = router;
