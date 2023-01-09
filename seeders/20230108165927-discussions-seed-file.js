/* eslint-disable no-unused-vars */
'use strict'
const faker = require('faker')
const { User } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, _Sequelize) {
    const userIdQuery = await User.findAll({ attributes: ['id'],
    raw: true })
    const userId = userIdQuery.map(instance => instance.id)
    await queryInterface.bulkInsert('Discussions', Array.from({ length:20 }, 
      () => ({
      header: faker.lorem.lines(1),
      content:faker.lorem.lines(3),
      user_id: userId[Math.floor(Math.random() * userId.length)],
      createdAt: new Date(),
      updatedAt: new Date()
      })
    ))
  },

  async down (queryInterface, _Sequelize) {
    queryInterface.bulkDelete('Discussions', {})
  }
}
