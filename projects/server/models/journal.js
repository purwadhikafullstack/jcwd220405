'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Journal.hasOne(models.Transaction);
      Journal.belongsTo(models.Journal_Type)
      Journal.belongsTo(models.Stock_Mutation)
      Journal.belongsTo(models.Product)
    }
  }
  Journal.init({
    stock_before: DataTypes.INTEGER,
    stock_after: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Journal',
  });
  return Journal;
};