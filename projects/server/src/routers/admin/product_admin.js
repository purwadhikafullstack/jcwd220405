const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { checkAuth } = require("../../middlewares/checkAuth");
const { productComp } = admin;

router.get("/admin/all_products", checkAuth, productComp.allProduct);
router.get("/admin/warehouse_products", checkAuth, productComp.warehouseProduct);
router.post("/admin/add_product", checkAuth, productComp.addProduct);
router.patch("/admin/edit_product/:id", checkAuth, productComp.editProduct);
router.delete("/admin/delete_product/:id", checkAuth, productComp.deleteProduct);

module.exports = router;
