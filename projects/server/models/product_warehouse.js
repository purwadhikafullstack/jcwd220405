'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Warehouses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product_Warehouses.belongsToMany(models.Transaction, {
        through: "Transaction_Product_Warehouses",
      })
    }
  }
  Product_Warehouses.init({
    stocks: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product_Warehouses',
  });
  return Product_Warehouses;
};