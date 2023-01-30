const db = require("../../../models");
const Transaction = db.Transaction;
const TransactionWarehouses = db.Transaction_Product_Warehouses;
const Warehouse = db.Warehouse;
const orderStatus = db.Order_Status;
const User = db.User;
const Product = db.Product;
const ProductWarehouses = db.Product_Warehouses;
const StockMutation = db.Stock_Mutation;
const Journal = db.Journal;
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
  rejectUserOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;
      if (status === "2") {
        await Transaction.update({ OrderStatusId: 1 }, { where: { id: id } });
        return res.status(201).send({ message: "Success Reject Order" });
      }
      return res.status(200).send({ message: "Reject Order" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  confirmUserOrder: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id, "jalan");

      // cari transaction user
      const userTransaction = await Transaction.findOne({
        where: { id: id },
        raw: true,
      });
      if (!userTransaction) {
        return res.status(200).send({
          message: `Transaction not found`,
        });
      }

      const detailUserTransaction = await TransactionWarehouses.findOne({
        where: { TransactionId: id },
        raw: true,
      });
      // cari transaction user

      // check stock di satu warehouse apakah ada
      const checkStock = await ProductWarehouses.findOne({
        where: {
          ProductId: detailUserTransaction.ProductId,
          WarehouseId: detailUserTransaction.WarehouseId,
        },
        raw: true,
      });

      if (!checkStock) {
        return res.status(200).send({
          message: `This warehouse doesn't have a product`,
        });
      }

      const originWarehouse = await Warehouse.findOne({
        where: { id: detailUserTransaction.WarehouseId },
        raw: true,
      });

      const originLat = originWarehouse.lat;
      const originLng = originWarehouse.lng;
      // check stock di satu warehouse apakah ada

      if (userTransaction.OrderStatusId === 2) {
        if (detailUserTransaction.quantity <= checkStock.stocks) {
          await Transaction.update({ OrderStatusId: 3 }, { where: { id: id } });
          await ProductWarehouses.update(
            { stocks: checkStock.stocks - detailUserTransaction.quantity },
            {
              where: {
                ProductId: detailUserTransaction.ProductId,
                WarehouseId: detailUserTransaction.WarehouseId,
              },
            }
          );
          await Journal.create({
            stock_before: checkStock.stocks,
            stock_after: checkStock.stocks - detailUserTransaction.quantity,
            desc: userTransaction.invoice,
            JournalTypeId: 1,
            ProductId: detailUserTransaction.ProductId,
            TransactionId: id,
          });
          return res.status(201).send({ message: "Success Confirm Order" });
        } else {
          console.log("buat cari warehouse terdekat dari warehouse origin");
          // check total product di semua warehouse
          const productInWarehouse = await ProductWarehouses.findAll({
            where: {
              ProductId: detailUserTransaction.ProductId,
              // stocks: { [Op.gt]: 0 },
            },
            raw: true,
          });

          const totalStockProductInWarehouse = productInWarehouse
            .map((item) => item.stocks)
            .reduce((a, b) => a + b, 0);

          if (totalStockProductInWarehouse < detailUserTransaction.quantity) {
            return res.status(200).send({
              message: `Product out of stock`,
            });
          }
          // check total product di semua warehouse

          // cari warehouse terdekat dari warehouse origin
          function toRad(value) {
            return (value * Math.PI) / 180;
          }
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

          const listWarehouse = await Warehouse.findAll({ raw: true });

          const nearestWarehouses = [];
          for (let i = 0; i < listWarehouse.length; i++) {
            const nearestWarehouse = calCrow(
              originLat,
              originLng,
              listWarehouse[i].lat,
              listWarehouse[i].lng
            );

            if (listWarehouse[i].id === originWarehouse.id) {
              continue;
            }

            nearestWarehouses.push({
              warehouse: listWarehouse[i],
              range: nearestWarehouse,
            });
          }

          const sortWarehouse = nearestWarehouses
            .sort((a, b) => a.range - b.range)
            .map((value) => value.warehouse.id);
          // cari warehouse terdekat dari warehouse origin

          // ambil product stock dari warehouse terdekat
          const readyOnWarehouse = [];
          for (let i = 0; i < productInWarehouse.length; i++) {
            for (let j = 0; j < sortWarehouse.length; j++) {
              if (
                productInWarehouse.map((item) => item.WarehouseId)[i] ===
                sortWarehouse[j]
              ) {
                readyOnWarehouse.push(productInWarehouse[i]);
              }
            }
          }
          const time = new Date();
          let index = 0;
          for (let i = 0; i < sortWarehouse.length; i++) {
            const fromWarehouse = await ProductWarehouses.findOne({
              where: {
                ProductId: detailUserTransaction.ProductId,
                WarehouseId: sortWarehouse[index],
              },
              raw: true,
            });
            const isReady = await ProductWarehouses.findOne({
              where: {
                ProductId: detailUserTransaction.ProductId,
                WarehouseId: detailUserTransaction.WarehouseId,
              },
              raw: true,
            });
            if (fromWarehouse.stocks === 0) {
              index += 1;
              continue;
            }
            await ProductWarehouses.update(
              { stocks: checkStock.stocks + fromWarehouse.stocks },
              {
                where: {
                  ProductId: detailUserTransaction.ProductId,
                  WarehouseId: detailUserTransaction.WarehouseId,
                },
              }
            );
            const Stock_Mutation = await StockMutation.create({
              IdWarehouseTo: originWarehouse.id,
              IdWarehouseFrom: fromWarehouse.WarehouseId,
              quantity: fromWarehouse.stocks,
              approval: true,
              invoice:
                time.getDate() +
                (time.getMonth() + 1) +
                time.getFullYear() +
                time.getHours() +
                time.getMinutes() +
                time.getSeconds(),
              ProductId: detailUserTransaction.ProductId,
            });
            await ProductWarehouses.update(
              { stocks: fromWarehouse.stocks - fromWarehouse.stocks },
              {
                where: {
                  ProductId: fromWarehouse.ProductId,
                  WarehouseId: fromWarehouse.WarehouseId,
                },
              }
            );
            // jurnal yang minta stock
            await Journal.create({
              stock_before: isReady.stocks,
              stock_after: isReady.stocks + fromWarehouse.stocks,
              desc: Stock_Mutation.invoice,
              JournalTypeId: 2,
              ProductId: detailUserTransaction.ProductId,
              StockMutationId: Stock_Mutation.id,
            });
            // jurnal yang minta stock

            // jurnal yang kasih stock
            await Journal.create({
              stock_before: fromWarehouse.stocks,
              stock_after: fromWarehouse.stocks - fromWarehouse.stocks,
              desc: Stock_Mutation.invoice,
              JournalTypeId: 3,
              ProductId: detailUserTransaction.ProductId,
              StockMutationId: Stock_Mutation.id,
            });
            // jurnal yang kasih stock

            const allReady = await ProductWarehouses.findOne({
              where: {
                ProductId: detailUserTransaction.ProductId,
                WarehouseId: detailUserTransaction.WarehouseId,
              },
              raw: true,
            });
            if (allReady.stocks >= detailUserTransaction.quantity) {
              await Transaction.update(
                { OrderStatusId: 3 },
                { where: { id: id } }
              );
              await ProductWarehouses.update(
                { stocks: allReady.stocks - detailUserTransaction.quantity },
                {
                  where: {
                    ProductId: detailUserTransaction.ProductId,
                    WarehouseId: detailUserTransaction.WarehouseId,
                  },
                }
              );
              // jurnal transaction
              await Journal.create({
                stock_before: allReady.stocks,
                stock_after: allReady.stocks - detailUserTransaction.quantity,
                desc: userTransaction.invoice,
                JournalTypeId: 1,
                ProductId: detailUserTransaction.ProductId,
                TransactionId: id,
              });
              // jurnal transaction
              return res.status(201).send({ message: "Success Confirm Order" });
            }
          }

          return res.status(200).send({ message: "Search Warehouse Done" });
        }
      }
      return res.status(200).send({ message: "Confirm Order" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
};
