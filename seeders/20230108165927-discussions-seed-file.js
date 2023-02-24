/* eslint-disable no-unused-vars */
'use strict'
const faker = require('faker')
const { User, Category } = require('../models')
const { pickRandomly, getRows } = require('../helpers/seeder-helpers')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const usersId = await getRows(User, 'id')
    const categoriesId = await getRows(Category, 'id')
    await queryInterface.bulkInsert(
      'Discussions',
      Array.from({ length: 20 }, () => ({
        header: faker.lorem.lines(1),
        content: faker.lorem.lines(3),
        user_id: pickRandomly(usersId),
        category_id: pickRandomly(categoriesId),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete(
      'Discussions',
      {},
      {
        truncate: true,
        restartIdentity: true,
      }
    )
  },
}
