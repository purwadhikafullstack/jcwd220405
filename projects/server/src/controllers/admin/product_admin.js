const { Op } = require("sequelize");
const db = require("../../../models");
const product = db.Product;
const category = db.Product_Category;

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
      const { sort, direction, pagination } = req.query;

      const pages = Math.ceil((await product.count()) / 10);

      const result = await product.findAll({
        include: [
          {
            model: category,
          },
        ],
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? (+pagination * 10) : 0,
      });

      res.status(200).send({ result, pages });
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  filterProduct: async (req, res) => {
    try {
      const { search, sort, direction, pagination } = req.query;

      const pages = Math.ceil(
        (await product.count({
          where: {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        })) / 10
      );

      const result = await product.findAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        include: [
          {
            model: category,
          },
        ],
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? (+pagination * 10) : 0,
      });

      res.status(200).send({ result, pages });
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
};
