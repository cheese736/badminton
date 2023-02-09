/* eslint-disable no-unused-vars */
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Discussion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discussion.belongsTo(models.User, { foreignKey: 'user_id' })
      Discussion.belongsTo(models.Category, { foreignKey: 'category_id' })
    }
  }
  Discussion.init(
    {
      header: DataTypes.TEXT,
      content: DataTypes.TEXT,
      user_id: DataTypes.INTEGER,
      views: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Discussion',
      tableName: 'Discussions',
    }
  )
  return Discussion
}
