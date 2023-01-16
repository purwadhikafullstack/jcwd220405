const router = require("express").Router();

const { orderList } = require("../controllers");

router.get("/order-list/:user", orderList.getOrderList);
router.post("/order-list/cancel/:user", orderList.cancelOrder);

module.exports = router;
