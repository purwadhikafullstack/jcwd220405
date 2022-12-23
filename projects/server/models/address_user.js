"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address_User.belongsTo(models.User, {
        foreignKey: "IdUser",
      });
    }
  }
  Address_User.init(
    {
      received_name: DataTypes.STRING,
      province: DataTypes.STRING,
      city_type: DataTypes.STRING,
      city: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      full_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address_User",
    }
  );
  return Address_User;
};
