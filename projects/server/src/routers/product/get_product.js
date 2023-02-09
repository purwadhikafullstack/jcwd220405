const router = require("express").Router();

const { getProduct } = require("../../controllers/product");

router.get("/product", getProduct.allProduct);
router.get("/product/detail/:name", getProduct.detailProduct);
router.get("/product/home", getProduct.homeProduct);
router.get("/category", getProduct.homeCategory);

module.exports = router;
