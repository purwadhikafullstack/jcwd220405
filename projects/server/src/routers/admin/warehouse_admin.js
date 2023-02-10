const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { checkAuth } = require("../../middlewares/checkAuth");
const { warehouseComp } = admin

router.post("/admin/add_warehouse", checkAuth, warehouseComp.addWarehouse);
router.delete("/admin/delete_warehouse/:id", checkAuth, warehouseComp.deleteWarehouse);
router.patch("/admin/edit_warehouse/:id", checkAuth, warehouseComp.editWarehouse);
router.get("/admin/all_warehouse", checkAuth, warehouseComp.allWarehouse);

module.exports = router;
