const router = require("express").Router();

const { rajaOngkir } = require("../controllers");

router.get("/province", rajaOngkir.getProvince);
router.get("/city/:province_id", rajaOngkir.getCity);

module.exports = router;
