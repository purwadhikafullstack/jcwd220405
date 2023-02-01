const router = require("express").Router();
const { admin } = require("../../controllers/index");
const { productComp } = admin;

router.get("/admin/all_products", productComp.allProduct);
router.get("/admin/filter_warehouse_products", productComp.filterWarehouseProduct);
router.post("/admin/add_product", productComp.addProduct);
router.patch("/admin/edit_product/:id", productComp.editProduct);
router.delete("/admin/delete_product/:id", productComp.deleteProduct);

module.exports = router;
