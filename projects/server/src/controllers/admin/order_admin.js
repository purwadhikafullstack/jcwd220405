const db = require("../../models");
const { Op } = require("sequelize");

const Transaction = db.Transaction;
const TransactionWarehouses = db.Transaction_Product_Warehouses;
const Warehouse = db.Warehouse;
const orderStatus = db.Order_Status;
const User = db.User;
const Address = db.Address_User;
const Product = db.Product;
const ProductWarehouses = db.Product_Warehouses;
const StockMutation = db.Stock_Mutation;
const Journal = db.Journal;

const schedule = require("node-schedule");
const moment = require("moment");
const fs = require("fs");
const transporter = require("../../helpers/transporter");
const handlebars = require("handlebars");
const path = require("path");

const { FEURL_BASE } = process.env;

module.exports = {
  allUserOrderList: async (req, res) => {
    try {
      const { id } = req.params;
      const { page, limit, wrId, role, status } = req.query;
      const page_list = +page || 0;
      const limit_list = +limit || 8;
      const offset = limit_list * page_list;
      const WarehouseId = +wrId || "";
      const orderId = +status || "";

      if (+role === 3) {
        const allOrder = await Transaction.findAll({
          where: {
            OrderStatusId: orderId ? orderId : { [Op.not]: null },
          },
          include: [
            { model: User, attributes: ["id", "name", "email"] },
            {
              model: Address,
              attributes: ["id", "received_name", "province", "city"],
            },
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
        const totalPage = Math.ceil(allOrder?.length / limit_list);

        return res.status(200).send({
          message: "For Admin",
          result: allOrder,
          page: page_list,
          limit: limit_list,
          offset: offset,
          totalRows: allOrder?.length,
          totalPage,
        });
      }

      if (+role === 2) {
        const AdminId = +id || "";
        const warehouse = await Warehouse.findOne({
          where: { UserId: AdminId },
          raw: true,
        });

        const branchOrder = await Transaction.findAll({
          where: {
            OrderStatusId: orderId ? orderId : { [Op.not]: null },
          },
          include: [
            { model: User, attributes: ["id", "name", "email"] },
            {
              model: Address,
              attributes: ["id", "received_name", "province", "city"],
            },
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
          offset: offset,
          limit: limit_list,
        });
        const totalPage = Math.ceil(branchOrder?.length / limit_list);

        return res.status(200).send({
          message: "For Admin Branch",
          result: branchOrder,
          page: page_list,
          limit: limit_list,
          offset: offset,
          totalRows: branchOrder?.length,
          totalPage,
        });
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
  statusList: async (req, res) => {
    try {
      const allStatus = await orderStatus.findAll({
        attributes: ["id", "status"],
        raw: true,
      });
      res.status(200).send({ message: "Status List", result: allStatus });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  rejectUserOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const userTransaction = await Transaction.findOne({
        where: { id: id },
        raw: true,
      });
      if (!userTransaction) {
        return res.status(200).send({
          message: `Transaction not found`,
        });
      }

      const user = await User.findOne({
        where: { id: userTransaction.IdUser },
        attributes: ["email"],
        raw: true,
      });

      if (userTransaction.OrderStatusId === 2) {
        await Transaction.update({ OrderStatusId: 1 }, { where: { id: id } });

        const tempEmail = fs.readFileSync(
          path.resolve(__dirname, "../../template/order-reject.html"),
          "utf-8"
        );
        const tempCompile = handlebars.compile(tempEmail);
        const tempResult = tempCompile({
          link: `${FEURL_BASE}/order-list`,
          transactionInformation: userTransaction,
          price: userTransaction.final_price.toLocaleString(),
          email: user.email,
        });

        await transporter.sendMail({
          from: "Admin",
          to: user.email,
          subject: `Order Rejected`,
          html: tempResult,
        });
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
      if (!userTransaction.payment_proof) {
        return res.status(200).send({
          message: `Payment Proof not found`,
        });
      }

      // change status
      await Transaction.update(
        {
          OrderStatusId: 3,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const transactionItems = await TransactionWarehouses.findAll({
        where: {
          TransactionId: id,
        },
        raw: true,
      });
      const itemId = transactionItems.map((item) => item.id);
      const productId = transactionItems.map((item) => item.ProductId);
      const warehouseId = transactionItems.map((item) => item.WarehouseId);
      const quantity = transactionItems.map((item) => item.quantity);

      const originWarehouse = await Warehouse.findOne({
        where: { id: warehouseId[0] },
        raw: true,
      });

      const originLat = originWarehouse.lat;
      const originLng = originWarehouse.lng;

      // Cari total stock dari tiap produk
      const totalStock = [];
      for (let i = 0; i < productId.length; i++) {
        const findStock = await ProductWarehouses.findAll({
          where: {
            WarehouseId: warehouseId[i],
            ProductId: productId[i],
          },
          raw: true,
        });
        totalStock.push(findStock[0].stocks);
      }

      // cari produk quantity yg lebih dari total stok
      const arr = [];
      for (let i = 0; i < totalStock.length; i++) {
        let result = 0;
        result = totalStock[i] - quantity[i];
        arr.push(result);
      }

      // di jadiin array
      const arr1 = arr.map((item, i) => {
        return {
          ItemId: itemId[i],
          productId: productId[i],
          quantity: quantity[i],
          stocks: item,
        };
      });

      // filter barang yg total stock nya kurang dari 0
      const stockMutation = arr1.filter((item) => {
        return item.stocks < 0;
      });

      // di jadikan bilangan positif
      const difference = stockMutation.map((item) => item.stocks * -1);

      // ambil id product
      const ProductMutationId = stockMutation.map((item) => item.productId);

      // ambil id transaction item
      const findTransactionItem = stockMutation.map((item) => item.ItemId);

      // // mencari warehouse terdekat
      const findClosestWarehouse = await Warehouse.findAll({ raw: true });

      function toRad(Value) {
        return (Value * Math.PI) / 180;
      }

      function calcCrow(lat1, lon1, lat2, lon2) {
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

      const chooseOne = [];
      for (let i = 0; i < findClosestWarehouse.length; i++) {
        const nearestWarehouse = calcCrow(
          originLat,
          originLng,
          findClosestWarehouse[i].lat,
          findClosestWarehouse[i].lng
        );

        if (findClosestWarehouse[i].id === originWarehouse.id) {
          continue;
        }

        chooseOne.push({
          warehouse: findClosestWarehouse[i],
          range: nearestWarehouse,
        });
      }

      const sortWarehouse = chooseOne
        .sort((a, b) => a.range - b.range)
        .map((value) => value.warehouse.id);

      // ambil product stock dari warehouse terdekat
      const minusStock = [];
      const closesStock = [];
      for (let i = 0; i < ProductMutationId.length; i++) {
        const findTotalStockProduct = await ProductWarehouses.findAll({
          where: {
            WarehouseId: sortWarehouse[i],
            ProductId: ProductMutationId[i],
          },
          raw: true,
        });

        if (findTotalStockProduct.map((val) => val.stocks) < difference[i]) {
          return res.status(200).json({
            message: `Warehouse ${sortWarehouse[i]} out of stock`,
          });
        }

        minusStock.push(
          findTotalStockProduct.map((val, idx) => val.stocks - difference[idx])
        );
        closesStock.push(findTotalStockProduct.map((val) => val.stocks));
      }

      // tambah stock ke warehouse origin transaction
      const plushStock = [];
      const beforeMut = [];
      for (let i = 0; i < ProductMutationId.length; i++) {
        const findTotalStockProduct = await ProductWarehouses.findAll({
          where: {
            WarehouseId: originWarehouse.id,
            ProductId: ProductMutationId[i],
          },
          raw: true,
        });

        plushStock.push(
          findTotalStockProduct.map((val) => val.stocks + difference[i])
        );
        beforeMut.push(findTotalStockProduct.map((val) => val.stocks));
      }

      // ngurangin stock buat dikirim ke warehouse origin
      const time = new Date();
      for (let i = 0; i < findTransactionItem.length; i++) {
        await ProductWarehouses.update(
          {
            stocks: minusStock[i],
          },
          {
            where: {
              WarehouseId: sortWarehouse[0],
              ProductId: ProductMutationId[i],
            },
          }
        );

        const Stock_Mutation = await StockMutation.create({
          IdWarehouseTo: originWarehouse.id,
          IdWarehouseFrom: sortWarehouse[0],
          quantity: difference[i],
          approval: true,
          invoice:
            time.getDate() +
            (time.getMonth() + 1) +
            time.getFullYear() +
            time.getHours() +
            time.getMinutes() +
            time.getSeconds(),
          ProductId: ProductMutationId[i],
        });

        await Journal.create({
          stock_before: closesStock[i],
          stock_after: minusStock[i],
          desc: Stock_Mutation.invoice,
          JournalTypeId: 4,
          ProductId: productId[i],
          StockMutationId: Stock_Mutation.id,
        });
      }

      // warehouse origin nerima stock dari warehouse terdekatnya
      for (let i = 0; i < findTransactionItem.length; i++) {
        await ProductWarehouses.update(
          {
            stocks: plushStock[i],
          },
          {
            where: {
              WarehouseId: originWarehouse.id,
              ProductId: ProductMutationId[i],
            },
          }
        );

        const Stock_Mutation = await StockMutation.create({
          IdWarehouseTo: originWarehouse.id,
          IdWarehouseFrom: sortWarehouse[0],
          quantity: difference[i],
          approval: true,
          invoice:
            time.getDate() +
            (time.getMonth() + 1) +
            time.getFullYear() +
            time.getHours() +
            time.getMinutes() +
            time.getSeconds(),
          ProductId: ProductMutationId[i],
        });

        await Journal.create({
          stock_before: beforeMut[i],
          stock_after: plushStock[i],
          desc: Stock_Mutation.invoice,
          JournalTypeId: 3,
          ProductId: productId[i],
          StockMutationId: Stock_Mutation.id,
        });
      }

      // stock di kurang dari WarehouseId yg sudah mutasi stock
      const finalStock = [];
      const stockBefore = [];
      for (let i = 0; i < productId.length; i++) {
        const findTotalStockProduct = await ProductWarehouses.findAll({
          where: {
            WarehouseId: originWarehouse.id,
            ProductId: productId[i],
          },
          raw: true,
        });

        finalStock.push(
          findTotalStockProduct.map((val) => val.stocks - quantity[i])
        );
        stockBefore.push(findTotalStockProduct.map((val) => val.stocks));
      }

      for (let i = 0; i < productId.length; i++) {
        await ProductWarehouses.update(
          {
            stocks: finalStock[i],
          },
          {
            where: {
              ProductId: productId[i],
              WarehouseId: originWarehouse.id,
            },
          }
        );

        // jurnal nyatet transaction nya
        await Journal.create({
          stock_before: stockBefore[i],
          stock_after: finalStock[i],
          desc: userTransaction.invoice,
          JournalTypeId: 1,
          ProductId: productId[i],
          TransactionId: id,
        });
      }

      const user = await User.findOne({
        where: { id: userTransaction.IdUser },
        attributes: ["email"],
        raw: true,
      });

      const tempEmail = fs.readFileSync(
        path.resolve(__dirname, "../../template/order-process.html"),
        "utf-8"
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        link: `${FEURL_BASE}/order-list`,
        transactionInformation: userTransaction,
        price: userTransaction.final_price.toLocaleString(),
        email: user.email,
      });

      await transporter.sendMail({
        from: "Admin",
        to: user.email,
        subject: `Order in Process`,
        html: tempResult,
      });

      return res.status(201).send({ message: "Success Confirm Order" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  sendUserOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const userTransaction = await Transaction.findOne({
        where: { id: id },
        raw: true,
      });
      if (!userTransaction) {
        return res.status(200).send({
          message: `Transaction not found`,
        });
      }

      await Transaction.update(
        {
          OrderStatusId: 4,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const afterSend = moment().add(7, "days").format("YYYY-MM-DD HH:mm:ss");

      schedule.scheduleJob(
        afterSend,
        async () =>
          await Transaction.update(
            {
              OrderStatusId: 5,
            },
            {
              where: {
                id: id,
              },
            }
          )
      );

      const user = await User.findOne({
        where: { id: userTransaction.IdUser },
        attributes: ["email"],
        raw: true,
      });

      const tempEmail = fs.readFileSync(
        path.resolve(__dirname, "../../template/order-send.html"),
        "utf-8"
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        link: `${FEURL_BASE}/order-list`,
        transactionInformation: userTransaction,
        price: userTransaction.final_price.toLocaleString(),
        email: user.email,
      });

      await transporter.sendMail({
        from: "Admin",
        to: user.email,
        subject: `Order on the wayyyyy`,
        html: tempResult,
      });

      return res.status(201).send({ message: "Success Send Order" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  cancelUserOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const userTransaction = await Transaction.findOne({
        where: { id: id },
        include: { model: TransactionWarehouses },
      });
      if (!userTransaction) {
        return res.status(200).send({
          message: `Transaction not found`,
        });
      }

      const quantity = userTransaction.Transaction_Product_Warehouses.map(
        (item) => item.quantity
      );
      const WarehouseId = userTransaction.Transaction_Product_Warehouses.map(
        (item) => item.WarehouseId
      );
      const ProductId = userTransaction.Transaction_Product_Warehouses.map(
        (item) => item.ProductId
      );

      if (userTransaction.OrderStatusId === 3) {
        const re_stock = [];
        const stock_before = [];
        for (let i = 0; i < ProductId.length; i++) {
          const findStock = await ProductWarehouses.findAll({
            where: {
              WarehouseId: WarehouseId[0],
              ProductId: ProductId[i],
            },
          });
          re_stock.push(findStock.map((item) => item.stocks + quantity[i]));
          stock_before.push(findStock.map((item) => item.stocks));
        }

        // update stock / balikkin stock
        for (let i = 0; i < ProductId.length; i++) {
          await ProductWarehouses.update(
            {
              ProductId: ProductId[i],
              stocks: re_stock[i],
            },
            {
              where: {
                WarehouseId: WarehouseId[0],
                ProductId: ProductId[i],
              },
            }
          );
        }

        const stock_after = [];
        for (let i = 0; i < ProductId.length; i++) {
          const findStock = await ProductWarehouses.findAll({
            where: {
              WarehouseId: WarehouseId[0],
              ProductId: ProductId[i],
            },
          });
          stock_after.push(findStock.map((item) => item.stocks));
        }

        await Transaction.update(
          {
            OrderStatusId: 6,
          },
          {
            where: {
              id: id,
            },
          }
        );

        for (let i = 0; i < ProductId.length; i++) {
          await Journal.create({
            stock_before: stock_before[i],
            stock_after: stock_after[i],
            desc: userTransaction.invoice + " - Cancel",
            JournalTypeId: 2,
            TransactionId: userTransaction.id,
            ProductId: ProductId[i],
          });
        }

        const user = await User.findOne({
          where: { id: userTransaction.IdUser },
          attributes: ["email"],
          raw: true,
        });

        const tempEmail = fs.readFileSync(
          path.resolve(__dirname, "../../template/order-cancel.html"),
          "utf-8"
        );
        const tempCompile = handlebars.compile(tempEmail);
        const tempResult = tempCompile({
          link: `${FEURL_BASE}/order-list`,
          transactionInformation: userTransaction,
          price: userTransaction.final_price.toLocaleString(),
          email: user.email,
        });

        await transporter.sendMail({
          from: "Admin",
          to: user.email,
          subject: `Order Canceled`,
          html: tempResult,
        });

        return res.status(201).send({
          status: userTransaction.OrderStatusId,
          message: "Success Cancel Order",
        });
      }
      return res.status(201).send({ message: "Cancel Order" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
};
