"use strict";
const { Model, STRING } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product_Category.hasOne(models.Product);
    }
  }
  Product_Category.init(
    {
      category: {
        type: STRING,
        unique: true,
      },
      image: {
        type: DataTypes.STRING(255),
        defaultValue: "/public/category/default-category.png",
      },
    },
    {
      sequelize,
      modelName: "Product_Category",
    }
  );
  return Product_Category;
};
