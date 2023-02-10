const db = require("../../models");
const { Op } = require("sequelize");

const Transaction = db.Transaction;
const TransactionWarehouses = db.Transaction_Product_Warehouses;
const Warehouse = db.Warehouse;
const Product = db.Product;
const ProductCategories = db.Product_Category;
const moment = require("moment");

module.exports = {
  getSalesList: async (req, res) => {
    try {
      const { month, categorie, wrId, search_query, id, role, page } =
        req.query;
      const whichCategorie = categorie || "";
      const whichMonth = month < 10 ? "0" + month : month || 0;
      const whichwarehouse = wrId || "";
      const search = search_query || "";

      let thisMoment = moment().format(`${moment().year()}-${whichMonth}-01`);
      let endOfMonth = moment(thisMoment).endOf("month").toDate();
      let startOfMonth = moment(thisMoment).startOf("month").toDate();

      if (+role === 3) {
        const page_list = +page || 0;
        const limit_list = 10;
        const totalRows = await Transaction.count({
          where: { OrderStatusId: 5 },
        });
        const offset = limit_list * page_list;
        const totalPage = Math.ceil(totalRows / limit_list);

        const allSales = await Transaction.findAll({
          where: {
            OrderStatusId: 5,
            updatedAt: month
              ? { [Op.between]: [startOfMonth, endOfMonth] }
              : { [Op.not]: null },
          },
          having: {
            ["Transaction_Product_Warehouses.Product.Product_Category.id"]:
              whichCategorie ? whichCategorie : { [Op.not]: null },
            ["Transaction_Product_Warehouses.Warehouse.id"]: whichwarehouse
              ? whichwarehouse
              : { [Op.not]: null },
            ["Transaction_Product_Warehouses.Product.name"]: {
              [Op.like]: "%" + search + "%",
            },
          },
          attributes: ["id", "invoice", "updatedAt"],
          include: [
            {
              model: TransactionWarehouses,
              attributes: ["id", "quantity", "price", "TransactionId"],
              require: true,
              include: [
                {
                  model: Product,
                  attributes: ["id", "name", "weight"],
                  require: true,
                  include: [
                    {
                      model: ProductCategories,
                      attributes: ["id", "category"],
                    },
                  ],
                },
                {
                  model: Warehouse,
                  attributes: ["warehouse_name"],
                },
              ],
            },
          ],
          offset: offset,
          limit: limit_list,
          subQuery: false,
        });

        let totalSales = [];
        let price = allSales.map((item) => {
          return item.Transaction_Product_Warehouses.map((item) => item.price);
        });
        let cleanprice = price.flat(1);
        let quantity = allSales.map((item) => {
          return item.Transaction_Product_Warehouses.map(
            (item) => item.quantity
          );
        });
        let cleanqty = quantity.flat(1);
        for (let i = 0; i < cleanprice.length; i++) {
          totalSales.push(cleanprice[i] * cleanqty[i]);
        }
        let cleantotalSales = totalSales.reduce((a, b) => a + b, 0);
        return res.status(200).send({
          allSales,
          cleantotalSales,
          page: page_list,
          limit: limit_list,
          totalRows: totalRows,
          totalPage: totalPage,
          offset: offset,
        });
      }

      if (+role === 2) {
        const adminId = +id || "";
        const warehouseBranch = await Warehouse.findOne({
          where: { UserId: adminId },
        });
        const page_list = +page || 0;
        const limit_list = 10;
        const totalRows = await Transaction.count({
          where: { OrderStatusId: 5 },
        });
        const offset = limit_list * page_list;
        const totalPage = Math.ceil(totalRows / limit_list);

        const branchSales = await Transaction.findAll({
          where: {
            OrderStatusId: 5,
            updatedAt: month
              ? { [Op.between]: [startOfMonth, endOfMonth] }
              : { [Op.not]: null },
          },
          having: {
            ["Transaction_Product_Warehouses.Product.Product_Category.id"]:
              whichCategorie ? whichCategorie : { [Op.not]: null },
            ["Transaction_Product_Warehouses.Warehouse.id"]: warehouseBranch.id,
            ["Transaction_Product_Warehouses.Product.name"]: {
              [Op.like]: "%" + search + "%",
            },
          },
          attributes: ["id", "invoice", "updatedAt"],
          include: [
            {
              model: TransactionWarehouses,
              attributes: ["id", "quantity", "price", "TransactionId"],
              require: true,
              include: [
                {
                  model: Product,
                  attributes: ["id", "name", "weight"],
                  require: true,
                  include: [
                    {
                      model: ProductCategories,
                      attributes: ["id", "category"],
                    },
                  ],
                },
                {
                  model: Warehouse,
                  attributes: ["warehouse_name"],
                },
              ],
            },
          ],
          offset: offset,
          limit: limit_list,
          subQuery: false,
        });
        let totalSales = [];
        let price = branchSales.map((item) => {
          // console.log(
          //   item.Transaction_Product_Warehouses,
          //   "ini priceeeeeeeeeeeeeeeeeeeee"
          // );
          return item.Transaction_Product_Warehouses.map((item) => item.price);
        });
        let cleanprice = price.flat(1);
        let quantity = branchSales.map((item) => {
          return item.Transaction_Product_Warehouses.map(
            (item) => item.quantity
          );
        });
        let cleanqty = quantity.flat(1);
        for (let i = 0; i < cleanprice.length; i++) {
          totalSales.push(cleanprice[i] * cleanqty[i]);
        }
        let cleantotalSales = totalSales.reduce((a, b) => a + b, 0);
        return res.status(200).send({
          allSales: branchSales,
          cleantotalSales,
          page: page_list,
          limit: limit_list,
          totalRows: totalRows,
          totalPage: totalPage,
        });
      }
      return res.status(200).send("Report Sales");
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
