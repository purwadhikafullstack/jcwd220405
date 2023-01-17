const { Op } = require("sequelize");
const db = require("../../../models");
const user = db.User;

module.exports = {
  allUser: async (req, res) => {
    try {
      const { sort, direction, pagination } = req.query;

      const result = await user.findAll({
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination : 0,
        raw: true,
      });
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  filterUser: async (req, res) => {
    try {
      const { search, sort, direction, pagination } = req.query;

      const result = await user.findAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 5,
        offset: pagination ? +pagination : 0,
        raw: true,
      });

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  editUser: async (req, res) => {
    try {
      await user.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send("Edit User Success");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  deleteUser: async (req, res) => {
    try {
      await user.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send("User Deleted");
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  WarehouseAdmin: async (req, res) => {
    try {
      const result = await user.findAll({
        where: {
          role: 2,
        },
        raw: true,
      });
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
};
