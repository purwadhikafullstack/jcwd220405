const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const db = require("../../models");
const product = db.Product;
const category = db.Product_Category;
const productWarehouses = db.Product_Warehouses;

module.exports = {
  addProduct: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      const { name, desc, price, weight, ProductCategoryId } = req.body;

      const result = await product.create({
        name,
        desc,
        price,
        weight,
        ProductCategoryId,
      });

      await db.Product_Image.create({
        image: "/public/product/default-product.png",
        IdProduct: result.id,
      });

      res.status(200).send({ msg: "Product Added", id: result.id });
    } catch (err) {
      res.status(400).send(err);
    }
  },
  editProduct: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      await product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      res.status(200).send("Edit Successful");
    } catch (err) {
      res.status(400).send(err);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      await product.destroy({
        where: {
          id: req.params.id,
        },
      });

      res.status(200).send("Product Deleted");
    } catch (err) {
      res.status(400).send(err);
    }
  },
  allProduct: async (req, res) => {
    try {
      if (req.role === 1) {
        throw "Unauthorize Access";
      }

      const { search, sort, direction, pagination } = req.query;

      const raw = await product.findAll();

      const { count, rows } = await product.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        include: [
          {
            model: category,
          },
          {
            model: productWarehouses,
            as: "Details",
          },
        ],
        attributes: {
          exclude: ["WarehouseId", "stocks"],
          include: [
            [Sequelize.fn("SUM", Sequelize.col("stocks")), "total_stocks"],
          ],
        },
        group: ["id"],
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination * 10 : 0,
        subQuery: false,
      });

      res
        .status(200)
        .send({ pages: Math.ceil(count.length / 10), result: rows, raw });
    } catch (err) {
      res.status(400).send(err);
    }
  },
  warehouseProduct: async (req, res) => {
    try {
      if (req.role === 1) {
        throw "Unauthorize Access";
      }

      const { search, sort, direction, pagination, warehouse } = req.query;

      const { count, rows } = await product.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        include: [
          {
            model: category,
          },
          {
            model: productWarehouses,
            as: "Details",
            where: {
              WarehouseId: warehouse,
            },
            required: false,
          },
        ],
        attributes: {
          include: [[Sequelize.col("stocks"), "total_stocks"]],
        },
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination * 10 : 0,
        subQuery: false,
      });

      res.status(200).send({ pages: Math.ceil(count / 10), result: rows });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
