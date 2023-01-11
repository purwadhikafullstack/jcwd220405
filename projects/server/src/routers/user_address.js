const router = require("express").Router();

const { userAddress } = require("../controllers");

router.get("/address/:user", userAddress.getAddressUser);
router.post("/address/:user", userAddress.addAddressUser);
router.post("/address/d/:user", userAddress.deleteAddressUser);
router.patch("/address/:user", userAddress.updateAddressUser);
router.post("/address/s/:user", userAddress.selectAddressUser);

module.exports = router;
