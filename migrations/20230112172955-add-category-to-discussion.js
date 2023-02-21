'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Discussions', 'categoryId', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('Discussions', 'categoryId')
  },
}
