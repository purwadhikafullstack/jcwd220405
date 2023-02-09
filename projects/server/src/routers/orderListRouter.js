const router = require("express").Router();

const { orderList } = require("../controllers");

router.get("/order-list/:user", orderList.getOrderList);
router.post("/order-list/cancel/:user", orderList.cancelOrder);
router.post("/order-list/complete/:user", orderList.completeOrder);
router.get("/order-list/l/statusList", orderList.transactionStatusList);

module.exports = router;
