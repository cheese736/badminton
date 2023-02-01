/* eslint-disable no-unused-vars */
'use strict'
const faker = require('faker')
const { City } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let citiesId = await City.findAll({ attributes: ['id'], raw: true })
    citiesId = citiesId.map((item) => item.id)
    await queryInterface.bulkInsert(
      'Parties',
      Array.from({ length: 30 }, () => ({
        name: faker.lorem.lines(1),
        host_name: faker.name.findName(),
        contact: faker.phone.phoneNumber('09##-######'),
        day_of_the_week: Math.floor(Math.random() * 7),
        court_location: faker.address.streetAddress(),
        city: citiesId[Math.floor(Math.random() * citiesId.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Parties', {})
  },
}
