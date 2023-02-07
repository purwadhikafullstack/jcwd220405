// const db = require("../../../models");
const db = require("../../models");
const cart = db.Cart;
const address = db.Address_User;
const product = db.Product;
const product_image = db.Product_Image;
const User = db.User;
const Warehouse = db.Warehouse;
const Transaction = db.Transaction;
const TransactionWarehouse = db.Transaction_Product_Warehouses;
const { Op } = require("sequelize");
const axios = require("axios");
const rajaOngkir = process.env.RAJA_ONGKIR;
const rajaOngkirURL = process.env.RAJA_ONGKIR_URL;

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
        `${rajaOngkirURL}/cost`,
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
      // console.log(cost);

      res.status(200).send(cost.data.rajaongkir.results);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getWarehouse: async (req, res) => {
    try {
      // const { WarehouseId } = req.body;
      const { id } = req.params;
      // find lat lng warehouse origin
      const originUser = await address.findOne({
        where: {
          idUser: id,
          status: 1,
        },
        raw: true,
      });

      // console.log(originUser);

      const originLat = originUser.lat;
      const originLng = originUser.lng;

      // console.log("buat cari warehouse");

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
      // console.log(closestWarehouse);

      const nearestOne = [];
      for (let i = 0; i < closestWarehouse.length; i++) {
        const nearestWarehouse = calCrow(
          originLat,
          originLng,
          closestWarehouse[i].lat,
          closestWarehouse[i].lng
        );

        // skipped warehouse same id
        // if (closestWarehouse[i].id === originWarehouse.id) {
        //   continue;
        // }
        // console.log(closestWarehouse[i]);

        nearestOne.push({
          warehouse: closestWarehouse[i],
          range: nearestWarehouse,
        });
      }

      const warehouseSort = nearestOne
        .sort((a, b) => a.range - b.range)
        .map((value) => value.warehouse);

      // console.log(warehouseSort);

      res.status(200).send({
        message: "Success",
        origin: warehouseSort,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  createOrder: async (req, res) => {
    try {
      const { user } = req.params;

      const time = new Date();

      const {
        delivery_fee,
        total_price,
        CartId,
        final_price,
        IdAddress,
        // quantity,
        // price,
        // product,
        WarehouseId,
        Item,
      } = req.body;

      const createOrder = await Transaction.create({
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
      // console.log(createOrder.id);
      // console.log(Item);

      let quantity = Item.map((item) => item.quantity);
      // console.log(quantity);
      let price = Item.map((item) => item.price);
      // console.log(price);
      let IdProduct = Item.map((item) => item.IdProduct);
      // console.log(IdProduct);

      for (let i = 0; i < IdProduct.length; i++) {
        await TransactionWarehouse.create({
          quantity: quantity[i],
          price: price[i],
          ProductId: IdProduct[i],
          TransactionId: createOrder.id,
          WarehouseId: WarehouseId,
        });
      }

      let cartDestroy = Item.map((item) => item.id);
      // console.log(cart);

      for (let i = 0; i < cartDestroy.length; i++) {
        await cart.destroy({
          where: {
            id: cartDestroy[i],
          },
        });
      }

      res.status(200).send({
        message: "Payment on progress, please upload your payment receipt",
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  uploadPayment: async (req, res) => {
    try {
      let fileUploaded = req.file;
      console.log(fileUploaded);

      const checkHasPaid = await Transaction.findOne({
        where: {
          id: req.params.id,
        },
        raw: true,
      });
      if (checkHasPaid.payment_proof) throw "You have already paid";

      // console.log(checkHasPaid);

      await Transaction.update(
        {
          payment_proof: `/public/payment/${fileUploaded.filename}`,
          OrderStatusId: 2,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res
        .status(200)
        .send("Payment Uploaded, Please Wait for Admin Confirmation");
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
