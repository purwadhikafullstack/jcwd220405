const { GEOAPIFY_KEY, GEOAPIFY_KEY_URL } = process.env;
const axios = require("axios");

const { Op } = require("sequelize");
const db = require("../../models");
const warehouse = db.Warehouse;

module.exports = {
  allWarehouse: async (req, res) => {
    try {
      if (req.role === 1) {
        throw "Unauthorize Access";
      }

      const { search, sort, direction, pagination } = req.query;

      const { count, rows } = await warehouse.findAndCountAll({
        where: {
          warehouse_name: {
            [Op.like]: `%${search}%`,
          },
        },
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
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
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      await warehouse.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      res.status(200).send("Edit Warehouse Success");
    } catch (err) {
      res.status(400).send(err);
    }
  },
  addWarehouse: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      const {
        warehouse_name,
        province,
        province_id,
        city,
        city_id,
        postal_code,
        UserId,
      } = req.body;

      const forwardAddress = await (
        await axios.get(
          `${GEOAPIFY_KEY_URL}/search?postcode=${postal_code}&city=${city}&province=${province}&limit=1&format=json&apiKey=${GEOAPIFY_KEY}`,
          {
            headers: { "Accept-Encoding": "gzip,deflate,compress" },
          }
        )
      ).data;

      const result = await warehouse.create({
        warehouse_name,
        province,
        province_id,
        city,
        city_id,
        postal_code,
        UserId,
        lat: +forwardAddress.results[0].lon,
        lng: +forwardAddress.results[0].lat,
      });

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  deleteWarehouse: async (req, res) => {
    try {
      if (req.role === 1 || req.role === 2) {
        throw "Unauthorize Access";
      }

      await warehouse.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send("Warehouse Deleted");
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
