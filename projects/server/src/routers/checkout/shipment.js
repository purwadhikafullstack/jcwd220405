const router = require("express").Router();

const { shipment } = require("../../controllers/checkout");

router.get("/shipment/:user", shipment.getShipment);
router.post("/shipment/cost", shipment.getCost);

module.exports = router;
