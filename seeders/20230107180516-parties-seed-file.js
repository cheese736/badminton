/* eslint-disable no-unused-vars */
'use strict'
const faker = require('faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Parties',
    Array.from({ length: 30 }, () => ({
      name: faker.lorem.lines(1),
      host_name: faker.name.findName(),
      contact: faker.phone.phoneNumber('09##-######'),
      day_of_the_week: Math.floor(Math.random() * 7),
      court_location: faker.address.streetAddress(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    ))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Parties', {})
  }
}
