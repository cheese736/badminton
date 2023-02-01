'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.bulkInsert(
      'Categories',
      ['equipment', 'injury', 'technique', 'chat', 'trade'].map((category) => ({
        name: category,
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  },
}
