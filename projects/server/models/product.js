"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Product_Image, {
        foreignKey: "IdProduct",
      });
      Product.hasMany(models.Cart);
      Product.hasMany(models.Journal);
      Product.hasOne(models.Stock_Mutation);
      Product.belongsToMany(models.Warehouse, {
        through: "Product_Warehouses",
      });
      Product.hasMany(models.Product_Warehouses, { as: "Details" });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING(255),
      },
      desc: {
        type: DataTypes.STRING(1234),
      },
      price: {
        type: DataTypes.INTEGER,
      },
      weight: {
        type: DataTypes.INTEGER,
      },
      category: {
        type: DataTypes.STRING(100),
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
