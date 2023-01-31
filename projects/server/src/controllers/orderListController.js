// const db = require("../../models");
const db = require("../models");
const transaction = db.Transaction;
const cart = db.Cart;
const product = db.Product;
const product_image = db.Product_Image;
const transaction_product = db.Transaction_Product_Warehouses;
const order_status = db.Order_Status;
const { Op } = require("sequelize");

module.exports = {
  getOrderList: async (req, res) => {
    try {
      const transactionUser = await transaction.findAll({
        where: { idUser: req.params.user },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: cart,
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
            ],
          },
          {
            model: order_status,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        // raw: true,
      });

      // console.log(transactionUser);

      res.status(200).send(transactionUser);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const idTransaction = req.body.id;
      const { user } = req.params;
      await transaction.update(
        {
          OrderStatusId: 6,
        },

        {
          where: { [Op.and]: [{ idUSer: user }, { id: idTransaction }] },
        }
      );

      res.status(200).send({
        message: "Transaction cancelation success",
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
