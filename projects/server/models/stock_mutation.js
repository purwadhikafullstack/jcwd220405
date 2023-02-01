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
      IdWarehouseTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      approval: {
        type: DataTypes.BOOLEAN,
      },
      invoice: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Stock_Mutation",
    }
  );
  return Stock_Mutation;
};
