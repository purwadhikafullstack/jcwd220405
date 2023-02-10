const { Op } = require("sequelize");
const db = require("../../models");
const product_category = db.Product_Category;

module.exports = {
  addCategory: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      const { category } = req.body;

      await product_category.create({
        category,
      });

      res.status(200).send("Category Added!");
    } catch (err) {
      res.status(400).send(err);
    }
  },
  editCategory: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      await product_category.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      res.status(200).send("Edit Successful");
    } catch (err) {
      res.status(400).send(err);
    }
  },
  deleteCategory: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      await product_category.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send("Category Deleted");
    } catch (err) {
      res.status(400).send(err);
    }
  },
  allCategory: async (req, res) => {
    try {
      if (req.role === 1) {
        throw "Unauthorize Access";
      }

      const { search, sort, direction, pagination } = req.query;

      const pages = Math.ceil(
        (await product_category.count({
          where: {
            category: {
              [Op.like]: `%${search}%`,
            },
          },
        })) / 10
      );

      const result = await product_category.findAll({
        where: {
          category: {
            [Op.like]: `%${search}%`,
          },
        },
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination * 10 : 0,
        raw: true,
      });

      res.status(200).send({ result, pages });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
