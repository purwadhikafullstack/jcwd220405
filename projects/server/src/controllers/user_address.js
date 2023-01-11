const db = require("../../models");
const user = db.User;
const address = db.Address_User;
const { Op } = require("sequelize");

module.exports = {
  getAddressUser: async (req, res) => {
    try {
      const { search_query } = req.query;
      const search = search_query || "";

      const addressUser = await address.findAll({
        where: {
          [Op.and]: [
            { IdUser: req.params.user },
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
            model: user,
            attributes: ["name"],
            required: true,
          },
        ],
        raw: true,
      });
      return res.status(200).send(addressUser);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  addAddressUser: async (req, res) => {
    try {
      const IdUser = req.params.user;
      const {
        received_name,
        province,
        city_type,
        city,
        postal_code,
        full_address,
        status,
        lat,
        lng,
        length,
      } = req.body;

      if (length > 4) throw "The address can only be 5";

      if (status)
        await address.update({ status: false }, { where: { IdUser: IdUser } });

      await address.create({
        received_name,
        province,
        city_type,
        city,
        postal_code,
        full_address,
        status: status ? 1 : 0,
        lat: lat ? lat : null,
        lng: lng ? lng : null,
        IdUser,
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
      const { id, status } = req.body;
      const { user } = req.params;
      if (status)
        await address.update({ status: false }, { where: { IdUser: user } });
      await address.update(req.body, {
        where: { [Op.and]: [{ IdUser: user }, { id: id }] },
      });
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
