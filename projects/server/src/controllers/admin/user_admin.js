const { Op } = require("sequelize");
// const db = require("../../../models");
const db = require("../../models");
const user = db.User;

module.exports = {
  allUser: async (req, res) => {
    try {
      const { sort, direction, pagination } = req.query;

      const pages = Math.ceil((await user.count()) / 10);

      const result = await user.findAll({
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination * 10 : 0,
        raw: true,
      });
      res.status(200).send({ result, pages });
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  filterUser: async (req, res) => {
    try {
      const { search, sort, direction, pagination } = req.query;

      const pages = Math.ceil(
        (await user.count({
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${search}%`,
                },
              },
              {
                email: {
                  [Op.like]: `%${search}%`,
                },
              },
            ],
          },
        })) / 10
      );

      const result = await user.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination * 10 : 0,
      });

      res.status(200).send({ result, pages });
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
  warehouseAdmin: async (req, res) => {
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
