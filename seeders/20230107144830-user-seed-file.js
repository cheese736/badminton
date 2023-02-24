/* eslint-disable no-unused-vars */
'use strict'
const bcrypt = require('bcryptjs')
const randAvatar = require('@ngneat/falso').randAvatar
const { City } = require('../models')
const { pickRandomly, getRows } = require('../helpers/seeder-helpers')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const citiesId = await getRows(City, 'id')
    await queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 20 }, (_item, i) => {
        const hash = bcrypt.hashSync('1234', 10)
        return {
          name: `user${i}`,
          email: `user${i}@example.com`,
          password: hash,
          avatar: randAvatar() + '?img=' + Math.ceil(Math.random() * 70),
          city: pickRandomly(citiesId),
          created_at: new Date(),
          updated_at: new Date(),
        }
      })
    )
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete(
      'Users',
      {},
      {
        truncate: true,
        restartIdentity: true,
      }
    )
  },
}
