const db = require("../models");
const transaction = db.Transaction;
const product = db.Product;
const product_image = db.Product_Image;
const transaction_product = db.Transaction_Product_Warehouses;
const order_status = db.Order_Status;
const warehouse = db.Warehouse;
const { Op } = require("sequelize");

module.exports = {
  getOrderList: async (req, res) => {
    try {
      const { page, limit, status } = req.query;
      const page_list = +page || 0;
      const limit_list = +limit || 5;
      const offset = page_list * limit_list;
      const totalRows = await transaction.count({
        where: { IdUser: req.params.user },
      });
      const totalPage = Math.ceil(totalRows / limit_list);
      const statusOrder = +status || "";

      const transactionUser = await transaction.findAll({
        where: {
          idUser: req.params.user,
          OrderStatusId: statusOrder ? statusOrder : { [Op.not]: null },
        },
        include: [
          {
            model: transaction_product,
            attributes: ["quantity", "price", "WarehouseId"],
            require: true,
            include: [
              {
                model: product,
                attributes: ["name", "weight"],
                require: true,
                include: [
                  {
                    model: product_image,
                    attributes: ["image"],
                  },
                ],
              },
              {
                model: warehouse,
                attributes: ["province", "city"],
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
        order: [["createdAt", "DESC"]],
        offset: offset,
        limit: limit_list,
      });

      res.status(200).send({
        message: "Transaction List",
        result: transactionUser,
        page: page_list,
        limit: limit_list,
        offset: offset,
        totalRows: totalRows,
        totalPage: totalPage,
      });
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
  completeOrder: async (req, res) => {
    try {
      const idTransaction = req.body.id;
      const { user } = req.params;
      await transaction.update(
        {
          OrderStatusId: 5,
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
  transactionStatusList: async (req, res) => {
    try {
      const allStatus = await order_status.findAll({
        attributes: ["id", "status"],
      });
      res.status(200).send({ message: "Status List", result: allStatus });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
