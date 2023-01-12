"use strict";
const { Model } = require("sequelize");
const product = require("./product");
const warehouse = require("./warehouse");
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
      });
      Product_Warehouses.belongsTo(models.Product);
      Product_Warehouses.belongsTo(models.Warehouse);
    }
  }
  Product_Warehouses.init(
    {
      stocks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Product_Warehouses",
      timestamps: false,
    }
  );
  return Product_Warehouses;
};
