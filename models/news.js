'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models) {
      // define association here
    }
  }
  News.init(
    {
      header: DataTypes.STRING,
      content: DataTypes.STRING,
      publish_date: DataTypes.DATE,
      country_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'News',
      tableName: 'News',
      underscored: true,
    }
  )
  return News
}
