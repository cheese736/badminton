/* eslint-disable no-unused-vars */
'use strict'
const bcrypt = require('bcryptjs')
const randAvatar = require('@ngneat/falso').randAvatar
const { City } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let citiesId = await City.findAll({ attributes: ['id'], raw: true })
    citiesId = citiesId.map((item) => item.id)
    await queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 20 }, (_item, i) => {
        const hash = bcrypt.hashSync('1234', 10)
        return {
          name: `user${i}`,
          email: `user${i}@example.com`,
          password: hash,
          avatar: randAvatar() + '?img=' + Math.ceil(Math.random() * 70),
          city: citiesId[Math.floor(Math.random() * citiesId.length)],
          created_at: new Date(),
          updated_at: new Date(),
        }
      })
    )
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users')
  },
}
