const router = require("express").Router();
const { admin } = require("../controllers/index");

// user
router.get("/admin/all_user", admin.allUser);
router.get("/admin/sort_user", admin.filterUser);
router.get("/admin/warehouse_admin", admin.WarehouseAdmin);
router.patch("/admin/edit_user/:id", admin.editUser);
router.delete("/admin/delete_user/:id", admin.deleteUser);

// warehouse
router.post("/admin/add_warehouse", admin.addWarehouse);
router.delete("/admin/delete_warehouse/:id", admin.deleteWarehouse);
router.get("/admin/all_warehouse", admin.allWarehouse);
router.get("/admin/filter_warehouse", admin.filterWarehouse);
router.patch("/admin/edit_warehouse/:id", admin.editWarehouse);

module.exports = router;
