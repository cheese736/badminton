'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models) {
      // define association here
    }
  }
  Country.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Country',
      tableName: 'Countries',
      underscored: true,
    }
  )
  return Country
}
