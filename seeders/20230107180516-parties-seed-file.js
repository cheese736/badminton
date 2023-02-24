/* eslint-disable no-unused-vars */
'use strict'
const faker = require('faker')
const { User, City } = require('../models')
const { pickRandomly, getRows } = require('../helpers/seeder-helpers')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const citiesId = await getRows(City, 'id')
    const usersId = await getRows(User, 'id')
    console.log(usersId)
    await queryInterface.bulkInsert(
      'Parties',
      Array.from({ length: 30 }, () => ({
        name: faker.lorem.lines(1),
        host_name: pickRandomly(usersId),
        contact: faker.phone.phoneNumber('09##-######'),
        day_of_the_week: Math.floor(Math.random() * 7),
        court_location: faker.address.streetAddress(),
        city: pickRandomly(citiesId),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Parties',
      {},
      {
        truncate: true,
        restartIdentity: true,
      }
    )
  },
}
