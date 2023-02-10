const { Op } = require("sequelize");
const db = require("../../models");
const journal = db.Journal;
const journal_type = db.Journal_Type;
const warehouse = db.Warehouse;

module.exports = {
  allJournal: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      const { sort, direction, pagination, WarehouseId } = req.query;

      const { count, rows } = await journal.findAndCountAll({
        where: {
          WarehouseId: {
            [Op.like]: `%${WarehouseId}%`,
          },
        },
        include: [{ model: journal_type }],
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination * 10 : 0,
      });

      res.status(200).send({ result: rows, pages: Math.ceil(count / 10) });
    } catch (err) {
      res.status(400).send(err);
    }
  },
  warehouseJournal: async (req, res) => {
    try {
      if (req.role === 1) {
        throw "Unauthorize Access";
      }

      const { sort, direction, pagination, UserId } = req.query;

      const adminWarehouse = await warehouse.findOne({
        where: {
          UserId,
        },
        attributes: {
          exclude: [
            "warehouse_name",
            "province",
            "province_id",
            "city",
            "city_id",
            "postal_code",
            "lat",
            "lng",
            "createdAt",
            "updatedAt",
          ],
        },
        raw: true,
      });

      if (!adminWarehouse) {
        return null;
      }

      const { count, rows } = await journal.findAndCountAll({
        where: {
          WarehouseId: adminWarehouse.id,
        },
        include: [{ model: journal_type }],
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination * 10 : 0,
      });

      res.status(200).send({ result: rows, pages: Math.ceil(count / 10) });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
