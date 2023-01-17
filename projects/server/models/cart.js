"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, {
        foreignKey: "IdUser",
      });
      Cart.belongsTo(models.Product, {
        foreignKey: "IdProduct",
      });
      Cart.hasOne(models.Transaction);
    }
  }
  Cart.init(
    {
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
