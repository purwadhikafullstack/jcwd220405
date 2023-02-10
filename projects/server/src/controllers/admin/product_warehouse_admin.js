const db = require("../../models");
const productWarehouses = db.Product_Warehouses;
const journal = db.Journal;

module.exports = {
  addStocks: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      const { stocks, ProductId, WarehouseId } = req.body;

      await productWarehouses.create({
        stocks,
        ProductId,
        WarehouseId,
      });

      res.status(200).send("Stocks Added");
    } catch (err) {
      res.status(400).send(err);
    }
  },
  deleteStocks: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

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
    }
  },
  editStocks: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      const { stocks } = req.body;
      const { ProductId, WarehouseId } = req.query;

      const productWarehouse = await productWarehouses.findOne({
        where: {
          ProductId,
          WarehouseId,
        },
        raw: true,
      });

      await journal.create({
        stock_before: productWarehouse.stocks,
        stock_after: stocks,
        desc: "Stock Update",
        JournalTypeId: stocks > productWarehouse.stocks ? 6 : 5,
        ProductId,
        WarehouseId,
      });

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
    }
  },
};
