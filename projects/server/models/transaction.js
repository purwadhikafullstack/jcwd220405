'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Order_Status);
      Transaction.belongsTo(models.Journal);
      Transaction.belongsTo(models.Cart);
      Transaction.belongsToMany(models.Product_Warehouses, {
        through: "Transaction_Product_Warehouses",
      })
    }
  }
  Transaction.init({
    invoice: DataTypes.STRING,
    delivery_fee: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};