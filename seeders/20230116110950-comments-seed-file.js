'use strict'
const falso = require('@ngneat/falso')
const { User, Discussion } = require('../models')
const { pickRandomly, getRows } = require('../helpers/seeder-helpers')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const usersId = await getRows(User, 'id')
    const discussionsId = await getRows(Discussion, 'id')
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 80 }, () => ({
        content: falso.randLine({ lineCount: 2 }),
        user_id: pickRandomly(usersId),
        discussion_id: pickRandomly(discussionsId),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete(
      'Comments',
      {},
      {
        truncate: true,
        restartIdentity: true,
      }
    )
  },
}
