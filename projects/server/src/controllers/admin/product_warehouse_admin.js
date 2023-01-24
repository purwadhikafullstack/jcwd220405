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
  deleteStocks: async (req, res) => {
    try {
      const { ProductId, WarehouseId } = req.body;

      await productWarehouses.destroy({
        where: {
          ProductId,
          WarehouseId,
        },
      });

      res.status(200).send("Stocks Deleted");
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
  //   totalStocks: async (req, res) => {
  //     try {
  //       const result = await productWarehouses.findAll({
  //         group: "ProductId",
  //         attributes: {
  //           exclude: ["WarehouseId", "stocks"],
  //           include: [
  //             [Sequelize.fn("SUM", Sequelize.col("stocks")), "total_stocks"],
  //           ],
  //         },
  //         raw: true,
  //       });

  //       res.status(200).send(result);
  //     } catch (err) {
  //       res.status(400).send(err);
  //       console.log(err);
  //     }
  //   },
  //   warehouseStocks: async (req, res) => {
  //     try {
  //       const result = await productWarehouses.findAll({
  //         where: {
  //           WarehouseId: req.params.id,
  //         },
  //       });

  //       res.status(200).send(result);
  //     } catch (err) {
  //       res.status(400).send(err);
  //       console.log(err);
  //     }
  //   },
};
