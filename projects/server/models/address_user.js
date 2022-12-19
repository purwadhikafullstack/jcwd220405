'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address_User.hasMany(models.User);
    }
  }
  Address_User.init({
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    city_type: DataTypes.STRING,
    postal_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Address_User',
  });
  return Address_User;
};