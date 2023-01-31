"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product_Image.belongsTo(models.Product, {
        foreignKey: "IdProduct",
      });
    }
  }
  Product_Image.init(
    {
      image: {
        type: DataTypes.STRING(255),
        defaultValue: "/public/profile/default-product.png",
      },
    },
    {
      sequelize,
      modelName: "Product_Image",
    }
  );
  return Product_Image;
};
