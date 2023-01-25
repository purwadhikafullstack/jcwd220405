const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { userOrderList } = admin;

router.post("/admin/order-list/:id", userOrderList.allUserOrderList);
router.get("/admin/warehouse-list/", userOrderList.warehouseList);
router.post("/admin/order-cancel/:id", userOrderList.rejectUserOrder);
router.post("/admin/order-confirm/:id", userOrderList.confirmUserOrder);

module.exports = router;
