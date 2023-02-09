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
const ProductCategories = db.Product_Category;

module.exports = {
  getSalesList: async (req, res) => {
    try {
      const { month } = req.query;
      const whichMonth = month || "";
      console.log(month);
      const allSales = await Transaction.findAll({
        where: {
          OrderStatusId: 5,
          updatedAt: whichMonth ? whichMonth : { [Op.not]: null },
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
      });
      res.status(200).send(allSales);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
