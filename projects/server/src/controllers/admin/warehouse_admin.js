const { Op } = require("sequelize");
const db = require("../../../models");
const warehouse = db.Warehouse;

module.exports = {
  allWarehouse: async (req, res) => {
    try {
      const { sort, direction, pagination } = req.query;

      const pages = Math.ceil((await warehouse.count()) / 10);

      const { count, rows } = await warehouse.findAndCountAll({
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination * 10 : 0,
        raw: true,
      });
      res.status(200).send({ pages: Math.ceil(count / 10), result: rows });
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  filterWarehouse: async (req, res) => {
    try {
      const { search, sort, direction, pagination } = req.query;

      const pages = Math.ceil(
        (await warehouse.count({
          where: {
            warehouse_name: {
              [Op.like]: search ? `%${search}%` : "",
            },
          },
        })) / 10
      );

      const { count, rows } = await warehouse.findAndCountAll({
        where: {
          warehouse_name: {
            [Op.like]: search ? `%${search}%` : "",
          },
        },
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 5,
        offset: pagination ? +pagination * 10 : 0,
        raw: true,
      });

      res.status(200).send({ pages: Math.ceil(count / 10), result: rows });
    } catch (err) {
      res.status(400).send(err);
    }
  },
  editWarehouse: async (req, res) => {
    try {
      await warehouse.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      res.status(200).send("Edit Warehouse Success");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  addWarehouse: async (req, res) => {
    try {
      const { warehouse_name, province, city, postal_code, UserId } = req.body;

      await warehouse.create({
        warehouse_name,
        province,
        city,
        postal_code,
        UserId,
      });

      res.status(200).send("Warehouse Created");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  deleteWarehouse: async (req, res) => {
    try {
      await warehouse.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send("Warehouse Deleted");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
};
