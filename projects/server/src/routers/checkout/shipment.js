const router = require("express").Router();

const { shipment } = require("../../controllers/checkout");

router.get("/shipment/:user", shipment.getShipment);
router.post("/shipment/cost", shipment.getCost);
router.post("/createOrder/:user", shipment.createOrder);


module.exports = router;
