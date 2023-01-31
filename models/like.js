'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models) {
      // define association here
    }
  }
  Like.init(
    {
      user_id: DataTypes.INTEGER,
      discussion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes',
      underscored: true,
    }
  )
  return Like
}
