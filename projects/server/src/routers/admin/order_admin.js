const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { userOrderList } = admin;

router.get("/admin/order-list/:id", userOrderList.allUserOrderList);
router.get("/admin/warehouse-list/", userOrderList.warehouseList);
router.get("/admin/status-list/", userOrderList.statusList);
router.post("/admin/order-reject/:id", userOrderList.rejectUserOrder);
router.post("/admin/order-confirm/:id", userOrderList.confirmUserOrder);
router.post("/admin/send-order/:id", userOrderList.sendUserOrder);
router.post("/admin/cancel-order/:id", userOrderList.cancelUserOrder);

module.exports = router;
