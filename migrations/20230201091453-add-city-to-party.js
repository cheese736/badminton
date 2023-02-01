'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Parties', 'city', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Cities',
        key: 'id',
      },
    })
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('Parties', 'city')
  },
}
