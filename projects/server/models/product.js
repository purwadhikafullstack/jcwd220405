'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Product_Image);
      Product.hasMany(models.Cart);
      Product.hasMany(models.Journal);
      Product.hasOne(models.Stock_Mutation);
      Product.belongsToMany(models.Warehouse, { through: "Product_Warehouses" });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    price: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};