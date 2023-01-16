/* eslint-disable no-unused-vars */
'use strict'
const faker = require('faker')
const { User, Category } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, _Sequelize) {
    const userIdQuery = await User.findAll({ attributes: ['id'],
    raw: true })
    const userId = userIdQuery.map(item => item.id)
    const categoryIdQuery = await Category.findAll({ attributes: ['id'],
    raw: true })
    const categoryId = categoryIdQuery.map(item => item.id)
    await queryInterface.bulkInsert('Discussions', Array.from({ length:20 }, 
      () => ({
      header: faker.lorem.lines(1),
      content:faker.lorem.lines(3),
      user_id: userId[Math.floor(Math.random() * userId.length)],
      category_id: categoryId[Math.floor(Math.random() * categoryId.length)],
      createdAt: new Date(),
      updatedAt: new Date()
      })
    ))
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('Discussions', {})
  }
}
