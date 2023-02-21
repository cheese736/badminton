'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Party extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Party.belongsTo(models.City, { foreignKey: 'city' })
    }
  }
  Party.init(
    {
      name: DataTypes.STRING,
      host_name: DataTypes.STRING,
      contact: DataTypes.STRING,
      day_of_the_week: DataTypes.INTEGER,
      court_location: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Party',
      tableName: 'Parties',
      underscored: true,
    }
  )
  return Party
}
