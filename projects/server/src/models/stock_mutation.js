"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock_Mutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Stock_Mutation.belongsTo(models.Warehouse)
      Stock_Mutation.belongsTo(models.Warehouse, {
        foreignKey: "IdWarehouseFrom",
      });
      Stock_Mutation.hasOne(models.Journal);
      Stock_Mutation.belongsTo(models.Product);
    }
  }
  Stock_Mutation.init(
    {
      IdWarehouseTo: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      approval: DataTypes.BOOLEAN,
      invoice: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Stock_Mutation",
    }
  );
  return Stock_Mutation;
};
