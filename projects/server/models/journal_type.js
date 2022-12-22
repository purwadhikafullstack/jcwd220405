'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Journal_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Journal_Type.hasMany(models.Journal)
    }
  }
  Journal_Type.init({
    type: DataTypes.STRING,
    append: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Journal_Type',
  });
  return Journal_Type;
};