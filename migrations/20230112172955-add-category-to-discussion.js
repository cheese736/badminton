'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Discussions', 'category_id', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('Discussions', 'category_id')
  },
}
