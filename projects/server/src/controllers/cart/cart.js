const db = require("../../models");
const Sequelize = require("sequelize");

const Cart = db.Cart;
const Product = db.Product;
const productImage = db.Product_Image;
const productWarehouses = db.Product_Warehouses;

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
                required: true,
              },
            ],
          },
        ],
        attributes: [
          "id",
          "quantity",
          "price",
          "status",
          "createdAt",
          "updatedAt",
          "IdUser",
          "IdProduct",
          [Sequelize.fn("SUM", Sequelize.col("stocks")), "total_stocks"],
        ],
        order: [["createdAt", "DESC"]],
      });

      const qty = listCart.map((item) => item.quantity);
      const selectedItem = listCart
        .filter((item) => item.status === true)
        .map((item) => item.quantity)
        .reduce((a, b) => a + b, 0);
      const totalPrice = listCart
        .filter((item) => item.status === true)
        .map((item) => item.price * item.quantity)
        .reduce((a, b) => a + b, 0);

      res.status(200).send({
        message: "Cart User",
        result: listCart,
        qty,
        selectedItem,
        totalPrice,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  userAddToCart: async (req, res) => {
    try {
      const { user } = req.params;
      const { quantity, price, IdProduct, totalStock } = req.body;

      const duplicateProductCart = await Cart.findOne({
        where: { IdUser: user, IdProduct: IdProduct },
        raw: true,
      });

      if (!duplicateProductCart && quantity > totalStock) {
        throw `Max purchases ${totalStock}`;
      }
      if (
        duplicateProductCart?.quantity >= totalStock ||
        duplicateProductCart?.quantity + quantity > totalStock
      ) {
        throw `Max purchases ${totalStock}`;
      }

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
      return res.status(400).send(error);
    }
  },
  userUpdateCart: async (req, res) => {
    try {
      const { IdCart, action, qty } = req.body;
      const { user } = req.params;

      const cartUser = await Cart.findOne({
        where: { IdUser: user, id: IdCart },
        include: [
          {
            model: Product,
            include: [
              {
                model: productWarehouses,
                as: "Details",
              },
            ],
          },
        ],
      });

      const productStock = cartUser.Product.Details.map(
        (item) => item.stocks
      ).reduce((a, b) => a + b, 0);

      if (+qty > productStock) throw `Max purchases ${productStock}`;

      if (action === "+") {
        if (cartUser.quantity + 1 > productStock)
          throw `Max purchases ${productStock}`;
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
      return res.status(400).send(error);
    }
  },
};
