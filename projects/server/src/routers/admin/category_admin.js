const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { categoryComp } = admin;

router.get("/admin/all_category", categoryComp.allCategory);
router.post("/admin/add_category", categoryComp.addCategory);
router.patch("/admin/edit_category/:id", categoryComp.editCategory);
router.delete("/admin/delete_category/:id", categoryComp.deleteCategory);

module.exports = router;
