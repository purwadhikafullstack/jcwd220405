const db = require("../../../models");
const cart = db.Cart;
const address = db.Address_User;
const product = db.Product;
const product_image = db.Product_Image;
const User = db.User;
const Warehouse = db.Warehouse;
const Transaction = db.Transaction;
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
      const { origin, destination, weight, courier, delivery_fee } = req.body;

      const cost = await axios.post(
        "https://api.rajaongkir.com/starter/cost",
        {
          origin,
          destination,
          weight,
          courier,
          delivery_fee,
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
  getWarehouse: async (req, res) => {
    try {
      // find lat lng warehouse origin
      const originWarehouse = await Warehouse.findOne({
        where: { id: WarehouseId },
        raw: true,
      });

      const originLat = originWarehouse.lat;
      const originLng = originWarehouse.lng;

      console.log("buat cari warehouse");

      function calCrow(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);

        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
      }

      function toRad(value) {
        return (value * Math.PI) / 180;
      }

      // find closest warehouses
      const closestWarehouse = await Warehouse.findAll({ raw: true });

      const nearestOne = [];
      for (let i = 0; i < closestWarehouse.length; i++) {
        const nearestWarehouse = calCrow(
          originLat,
          originLng,
          closestWarehouse[i].lat,
          closestWarehouse[i].lng
        );

        // skipped warehouse same id
        if (closestWarehouse[i].id === originWarehouse.id) {
          continue;
        }

        nearestOne.push({
          warehouse: closestWarehouse[i],
          range: nearestWarehouse,
        });
      }

      const warehouseSort = nearestOne
        .sort((a, b) => a.range - b.range)
        .map((value) => value.warehouse.id);

      console.log(warehouseSort);
      res.status(200).send("Success");
    } catch (err) {
      res.status(400).send(err);
    }
  },
  createOrder: async (req, res) => {
    try {
      const { user } = req.params;

      const time = new Date();

      const { delivery_fee, total_price, CartId, final_price, IdAddress } =
        req.body;

      await Transaction.create({
        delivery_fee: delivery_fee,
        total_price: total_price,
        // CartId: CartId,
        IdUser: user,
        final_price: final_price,
        IdAddress: IdAddress,
        invoice:
          time.getDate() +
          (time.getMonth() + 1) +
          time.getFullYear() +
          time.getHours() +
          time.getMinutes() +
          time.getSeconds(),
        OrderStatusId: 1,
      });
      res.status(200).send("Silahkan upload bukti pembayaran");
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
