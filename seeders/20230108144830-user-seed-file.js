/* eslint-disable no-unused-vars */
'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',Array.from({ length: 20 }, (_item, i) => {
      const hash = bcrypt.hashSync('1234', 10)
      return {
        name: `user${i}`,
        email: `user${i}@example.com`,
        password: hash,
        avatar: faker.image.avatar(),
        created_at: new Date(),
        updated_at: new Date()
      }
    })
  )},

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users', {})
  }
}
