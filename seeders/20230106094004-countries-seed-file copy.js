/* eslint-disable no-unused-vars */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Countries',
    [
    'Taiwan','China','Japan' ,'Korea' ,'Indonesia', 'India', 'Malaysia',  'Singapore','England', 'Denmark', 'Spain', 'Thaiand' 
    ].map(country => {
      return {
        name:country,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Countries', {})
  }
}
