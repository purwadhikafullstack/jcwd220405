const { GEOAPIFY_KEY, GEOAPIFY_KEY_URL } = process.env;
const axios = require("axios");

const { Op } = require("sequelize");
const db = require("../../models");
const warehouse = db.Warehouse;

module.exports = {
  allWarehouse: async (req, res) => {
    try {
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

      // console.log(forwardAddress.results[0].lon)
      // console.log(forwardAddress.results[0].lat)

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
