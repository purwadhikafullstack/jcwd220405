"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Address_User, {
        foreignKey: "IdUser",
      });
      User.hasOne(models.Cart);
      User.hasOne(models.Warehouse);
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      picture: {
        type: DataTypes.STRING(100),
        defaultValue: "/public/profile/default-profile.png",
      },
      birthDate: {
        type: DataTypes.DATEONLY,
      },
      gender: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
