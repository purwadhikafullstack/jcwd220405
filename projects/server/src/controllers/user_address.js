const db = require("../models");
const { Op } = require("sequelize");
const User = db.User;
const address = db.Address_User;

const axios = require("axios");

const { GEOAPIFY_KEY, RAJA_ONGKIR, RAJA_ONGKIR_URL } = process.env;

module.exports = {
  getAddressUser: async (req, res) => {
    try {
      const { search_query } = req.query;
      const { user } = req.params;
      const search = search_query || "";

      const addressUser = await address.findAll({
        where: {
          [Op.and]: [
            { idUser: user },
            {
              [Op.or]: [
                {
                  received_name: {
                    [Op.like]: "%" + search + "%",
                  },
                },
                {
                  full_address: {
                    [Op.like]: "%" + search + "%",
                  },
                },
              ],
            },
          ],
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["status", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["name"],
            required: true,
          },
        ],
        raw: true,
      });

      const defaultName = addressUser?.map((item) => item["User.name"]);
      return res
        .status(200)
        .send({ result: addressUser, name: defaultName ? defaultName[0] : "" });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  getProvince: async (req, res) => {
    try {
      const response = await (
        await axios.get(`${RAJA_ONGKIR_URL}/province`, {
          headers: {
            key: RAJA_ONGKIR,
            "content-type": "application/x-www-form-urlencoded",
          },
        })
      ).data;

      return res
        .status(200)
        .json({ raw: response, result: response.rajaongkir.results });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  getCity: async (req, res) => {
    try {
      const { province_id } = req.params;
      const response = await (
        await axios.get(`${RAJA_ONGKIR_URL}/city?province=${province_id}`, {
          headers: {
            key: RAJA_ONGKIR,
            "content-type": "application/x-www-form-urlencoded",
          },
        })
      ).data;

      return res
        .status(200)
        .json({ raw: response, result: response.rajaongkir.results });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  addAddressUser: async (req, res) => {
    try {
      const { user } = req.params;
      const {
        received_name,
        province,
        province_id,
        city,
        city_id,
        city_type,
        postal_code,
        full_address,
        status,
        length,
      } = req.body;

      const forwardAddress = await (
        await axios.get(
          `https://api.geoapify.com/v1/geocode/search?street=${full_address}&postcode=${postal_code}&city=${city}&limit=1&format=json&apiKey=${GEOAPIFY_KEY}`,
          {
            headers: { "Accept-Encoding": "gzip,deflate,compress" },
          }
        )
      ).data;

      const lat = forwardAddress?.results[0]?.lat;
      const lng = forwardAddress?.results[0]?.lon;

      if (length > 4) throw "The address can only be 5";

      if (status)
        await address.update({ status: false }, { where: { IdUser: user } });

      const check = !length ? 1 : 0;

      await address.create({
        received_name,
        province,
        province_id,
        city,
        city_id,
        city_type,
        postal_code,
        full_address,
        status: check ? check : status ? 1 : 0,
        lat: lat ? lat : null,
        lng: lng ? lng : null,
        IdUser: user,
      });
      return res.status(201).send({
        status: "Success",
        message: "Success add address",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  deleteAddressUser: async (req, res) => {
    try {
      const idAddress = req.body.id;
      const { user } = req.params;
      await address.destroy({
        where: { [Op.and]: [{ IdUser: user }, { id: idAddress }] },
      });
      return res.status(201).send({
        status: "Success",
        message: "Success delete address",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  updateAddressUser: async (req, res) => {
    try {
      const { user } = req.params;
      const {
        received_name,
        province,
        province_id,
        city,
        city_id,
        city_type,
        postal_code,
        full_address,
        status,
        addressId,
      } = req.body;

      const forwardAddress = await (
        await axios.get(
          `https://api.geoapify.com/v1/geocode/search?street=${full_address}&postcode=${postal_code}&city=${city}&limit=1&format=json&apiKey=${GEOAPIFY_KEY}`,
          {
            headers: { "Accept-Encoding": "gzip,deflate,compress" },
          }
        )
      ).data;

      const lat = forwardAddress?.results[0]?.lat;
      const lng = forwardAddress?.results[0]?.lon;
      if (status)
        await address.update({ status: false }, { where: { IdUser: user } });
      await address.update(
        {
          received_name,
          province,
          province_id,
          city,
          city_id,
          city_type,
          postal_code,
          full_address,
          status,
          lat: lat ? lat : null,
          lng: lng ? lng : null,
        },
        {
          where: { [Op.and]: [{ IdUser: user }, { id: addressId }] },
        }
      );
      return res.status(201).send({
        status: "Success",
        message: "Success update address",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  selectAddressUser: async (req, res) => {
    try {
      const idAddress = req.body.id;
      const { user } = req.params;
      await address.update({ status: false }, { where: { IdUser: user } });
      await address.update(
        { status: true },
        {
          where: { [Op.and]: [{ IdUser: user }, { id: idAddress }] },
        }
      );
      return res.status(201).send({
        status: "Success",
        message: "Success select address",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
};
