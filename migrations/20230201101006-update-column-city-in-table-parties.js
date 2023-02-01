'use strict'
const { City } = require('../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let cities = await City.findAll({
      attributes: ['name'],
      raw: true,
    })
    cities = cities.map((item) => item.name)
    await queryInterface.bulkUpdate('Parties', {
      city: Math.floor(Math.random() * cities.length),
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('Parties', {
      city: null,
    })
  },
}
