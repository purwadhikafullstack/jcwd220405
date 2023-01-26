const db = require("../../../models");
const cart = db.Cart;
const address = db.Address_User;
const product = db.Product;
const product_image = db.Product_Image;
const User = db.User;
const { Op } = require("sequelize");
const axios = require("axios");
const rajaOngkir = process.env.RAJA_ONGKIR;

module.exports = {
  getShipment: async (req, res) => {
    const { user } = req.params;

    try {
      const shipmentDetails = await cart.findAll({
        where: {
          idUser: user,
          status: 1,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: product,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: product_image,
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
          {
            model: User,
            attributes: ["id"],
            include: [
              {
                model: address,
                where: {
                  status: 1,
                },
              },
            ],
          },
        ],
      });
      res.status(200).send(shipmentDetails);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getCost: async (req, res) => {
    try {
      // const { user } = req.params;
      const { origin, destination, weight, courier } = req.body;

      const cost = await axios.post(
        "https://api.rajaongkir.com/starter/cost",
        {
          origin,
          destination,
          weight,
          courier,
        },
        {
          headers: {
            key: rajaOngkir,
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );

      res.status(200).send(cost.data.rajaongkir.results);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
