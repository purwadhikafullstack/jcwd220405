const db = require("../../../models");
const Transaction = db.Transaction;
const TransactionWarehouses = db.Transaction_Product_Warehouses;
const Warehouse = db.Warehouse;
const orderStatus = db.Order_Status;
const User = db.User;
const Product = db.Product;
const { Op } = require("sequelize");

module.exports = {
  allUserOrderList: async (req, res) => {
    try {
      const { id } = req.params;
      const { role, wrId } = req.body;
      const { page, limit } = req.query;
      const page_list = +page || 0;
      const limit_list = +limit || 8;
      const offset = limit_list * page_list;
      const WarehouseId = +wrId || "";
      const totalRows = await Transaction.count();
      const totalPage = Math.ceil(totalRows / limit_list);
      if (+role === 3) {
        const allOrder = await Transaction.findAll({
          include: [
            { model: User, attributes: ["id", "name", "email"] },
            {
              model: TransactionWarehouses,
              where: {
                WarehouseId: WarehouseId ? WarehouseId : { [Op.not]: null },
              },
              required: true,
              include: [
                {
                  model: Product,
                  attributes: ["id", "name"],
                },
                {
                  model: Warehouse,
                  attributes: ["id", "warehouse_name", "province"],
                },
              ],
            },
            {
              model: orderStatus,
              attributes: ["id", "status"],
              required: true,
            },
          ],
          order: [["OrderStatusId", "ASC"]],
          offset: offset,
          limit: limit_list,
        });
        return res.status(200).send({
          message: "For Admin",
          result: allOrder,
          page: page_list,
          limit: limit_list,
          offset: offset,
          totalRows: totalRows,
          totalPage: totalPage,
        });
      }
      if (+role === 2) {
        const AdminId = +id || "";
        const warehouse = await Warehouse.findOne({
          where: { UserId: AdminId },
          raw: true,
        });

        const branchOrder = await Transaction.findAll({
          include: [
            { model: User, attributes: ["id", "name", "email"] },
            {
              model: TransactionWarehouses,
              where: { WarehouseId: warehouse.id },
              required: true,
              include: [
                {
                  model: Product,
                  attributes: ["id", "name"],
                },
                {
                  model: Warehouse,
                  attributes: ["id", "warehouse_name", "province"],
                },
              ],
            },
            {
              model: orderStatus,
              attributes: ["id", "status"],
              required: true,
            },
          ],
          order: [["OrderStatusId", "ASC"]],
        });
        return res
          .status(200)
          .send({ message: "For Admin Branch", result: branchOrder });
      }
      return res.status(200).send("order list");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  warehouseList: async (req, res) => {
    try {
      const allWarehouse = await Warehouse.findAll({
        attributes: ["id", "warehouse_name"],
        raw: true,
      });
      res.status(200).send({ message: "Warehouse List", result: allWarehouse });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
};
