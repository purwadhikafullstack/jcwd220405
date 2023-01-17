const { Op } = require("sequelize");
const db = require("../../../models");
const product = db.Product;
const category = db.Product_Category

module.exports = {
  AddProduct: async (req, res) => {
    try {
      const { name, desc, price, weight, ProductCategoryId } = req.body;

      await product.create({
        name,
        desc,
        price,
        weight,
        ProductCategoryId,
      });

      res.status(200).send("Product Added");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  editProduct: async (req, res) => {
    try {
      await product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      res.status(200).send("Edit Successful");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await product.destroy({
        where: {
          id: req.params.id,
        },
      });

      res.status(200).send("Product Deleted");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  allProduct: async (req, res) => {
    try {
      const result = await product.findAll({
        include: [
          { model: category }
        ]
      });

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  filterProduct: async (req, res) => {
    try {
      const { search, sort, direction, pagination } = req.query;

      //   const result = await product.findAll({
      //     where: {
      //       warehouse_name: {
      //         [Op.like]: search ? `%${search}%` : "",
      //       },
      //     },
      //     order: [[sort ? sort : "id", direction ? direction : "ASC"]],
      //     limit: 5,
      //     offset: pagination ? +pagination : 0,
      //     raw: true,
      //   });

      res.status(200).send("result");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
};
