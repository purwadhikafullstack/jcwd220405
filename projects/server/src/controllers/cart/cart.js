const db = require("../../../models");
const Cart = db.Cart;
const Product = db.Product;
const productImage = db.Product_Image;
const productWarehouses = db.Product_Warehouses;
const Sequelize = require("sequelize");

module.exports = {
  userCart: async (req, res) => {
    try {
      const { user } = req.params;
      const listCart = await Cart.findAll({
        where: { IdUser: user },
        group: ["ProductId"],
        include: [
          {
            model: Product,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            required: true,
            include: [
              {
                model: productImage,
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
                required: true,
              },
              {
                model: productWarehouses,
                as: "Details",
                attributes: [
                  "stocks",
                  "ProductId",
                  "WarehouseId",
                  [
                    Sequelize.fn("SUM", Sequelize.col("stocks")),
                    "total_stocks",
                  ],
                ],
                required: true,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).send({
        message: "Cart User",
        result: listCart,
      });
    } catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  },
  userAddToCart: async (req, res) => {
    try {
      const { user } = req.params;
      const { quantity, price, IdProduct } = req.body;

      const duplicateProductCart = await Cart.findOne({
        where: { IdUser: user, IdProduct: IdProduct },
        raw: true,
      });

      if (duplicateProductCart) {
        await Cart.update(
          { quantity: duplicateProductCart.quantity + +quantity, price: price },
          {
            where: { IdUser: user, IdProduct: IdProduct },
          }
        );
        return res.status(201).send({
          message: "Update Cart",
        });
      }

      await Cart.create({
        quantity: quantity,
        price: price,
        IdProduct: IdProduct,
        IdUser: user,
        status: 0,
      });

      res.status(201).send({
        message: "Success Add Cart",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  userDeleteCart: async (req, res) => {
    try {
      const { IdCart } = req.body;
      const { user } = req.params;
      await Cart.destroy({
        where: { IdUser: user, id: IdCart },
      });
      return res.status(201).send({
        message: "Success delete cart",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  userUpdateCart: async (req, res) => {
    try {
      const { IdCart, action, qty } = req.body;
      const { user } = req.params;

      const cartUser = await Cart.findOne({
        where: { IdUser: user, id: IdCart },
        raw: true,
      });

      if (action === "+") {
        await Cart.update(
          { quantity: cartUser.quantity + 1 },
          {
            where: { IdUser: user, id: IdCart },
          }
        );
        return res.status(201).send({
          action: "increment",
          message: "Success update cart",
        });
      }
      if (action === "-") {
        await Cart.update(
          { quantity: cartUser.quantity - 1 },
          {
            where: { IdUser: user, id: IdCart },
          }
        );
        return res.status(201).send({
          action: "decrement",
          message: "Success update cart",
        });
      }
      if (qty) {
        await Cart.update(
          { quantity: +qty },
          {
            where: { IdUser: user, id: IdCart },
          }
        );
        return res.status(201).send({
          action: "input",
          message: "Success update cart",
        });
      }

      return res.status(201).send({
        action: "",
        message: "empty",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  userSelectCart: async (req, res) => {
    try {
      const { IdCart, type } = req.body;
      const { user } = req.params;

      if (type === "checked") {
        await Cart.update(
          { status: 1 },
          {
            where: { IdUser: user, id: IdCart },
          }
        );
        return res.status(201).send({
          type: "checked",
          message: "Success select cart",
        });
      }
      if (type === "unchecked") {
        await Cart.update(
          { status: 0 },
          {
            where: { IdUser: user, id: IdCart },
          }
        );
        return res.status(201).send({
          type: "unchecked",
          message: "Success unselect cart",
        });
      }

      return res.status(201).send({
        type: "",
        message: "empty",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
};
