const router = require("express").Router();

const { shipment } = require("../../controllers/checkout");
const { uploadPaymentProof } = require("../../helpers/multer");

router.get("/shipment/:user", shipment.getShipment);
router.post("/shipment/cost", shipment.getCost);
router.post("/createOrder/:user", shipment.createOrder);
router.post(
  "/uploadpayment/:id",
  uploadPaymentProof.single("image"),
  shipment.uploadPayment
);

module.exports = router;
