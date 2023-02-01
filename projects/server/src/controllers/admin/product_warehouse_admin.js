const Sequelize = require("sequelize");
const db = require("../../../models");
const productWarehouses = db.Product_Warehouses;

module.exports = {
  addStocks: async (req, res) => {
    try {
      const { stocks, ProductId, WarehouseId } = req.body;

      await productWarehouses.create({
        stocks,
        ProductId,
        WarehouseId,
      });

      res.status(200).send("Stocks Updated");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  editStocks: async (req, res) => {
    try {
      const { stocks } = req.body;
      const { ProductId, WarehouseId } = req.query;

      await productWarehouses.update(
        {
          stocks,
        },
        {
          where: {
            ProductId,
            WarehouseId,
          },
        }
      );

      res.status(200).send("Stocks Updated");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
};
