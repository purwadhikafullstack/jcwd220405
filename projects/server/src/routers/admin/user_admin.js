const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { checkAuth } = require("../../middlewares/checkAuth");
const { userComp } = admin;

router.get("/admin/all_user", checkAuth, userComp.allUser);
router.get("/admin/warehouse_admin", checkAuth, userComp.warehouseAdmin);
router.patch("/admin/edit_user/:id", checkAuth, userComp.editUser);
router.delete("/admin/delete_user/:id", checkAuth, userComp.deleteUser);

module.exports = router;
