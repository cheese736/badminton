'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.City, { foreignKey: 'city' })
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      city: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true,
    }
  )
  return User
}
