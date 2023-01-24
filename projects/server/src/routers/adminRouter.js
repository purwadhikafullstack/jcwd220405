const userComp = require("./admin/user_admin");
const warehouseComp = require("./admin/warehouse_admin");
const productComp = require("./admin/product_admin");
const categoryComp = require("./admin/category_admin");
const stocksComp = require("./admin/product_warehouse_admin");
const userOrderList = require("./admin/order_admin");

module.exports = {
  userComp,
  warehouseComp,
  productComp,
  categoryComp,
  stocksComp,
  userOrderList,
};
