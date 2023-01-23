"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Warehouse.belongsTo(models.User);
      Warehouse.hasMany(models.Stock_Mutation, {
        foreignKey: "IdWarehouseFrom",
      });
      Warehouse.belongsToMany(models.Product, {
        through: "Product_Warehouses",
      });
      Warehouse.hasMany(models.Transaction_Product_Warehouses);
    }
  }
  Warehouse.init(
    {
      warehouse_name: DataTypes.STRING,
      province: DataTypes.STRING,
      province_id: { type: DataTypes.STRING, allowNull: true },
      city: DataTypes.STRING,
      city_id: { type: DataTypes.STRING, allowNull: true },
      postal_code: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Warehouse",
    }
  );
  return Warehouse;
};
