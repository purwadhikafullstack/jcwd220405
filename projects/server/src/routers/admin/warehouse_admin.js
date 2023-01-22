const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { warehouseComp } = admin

router.post("/admin/add_warehouse", warehouseComp.addWarehouse);
router.delete("/admin/delete_warehouse/:id", warehouseComp.deleteWarehouse);
router.patch("/admin/edit_warehouse/:id", warehouseComp.editWarehouse);
router.get("/admin/all_warehouse", warehouseComp.allWarehouse);
router.get("/admin/filter_warehouse", warehouseComp.filterWarehouse);

module.exports = router;
