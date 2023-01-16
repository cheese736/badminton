'use strict'
const falso = require('@ngneat/falso')
const { User, Discussion } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, _Sequelize) {
    const userIdQuery = await User.findAll({ attributes: ['id'],
    raw: true })
    const userId = userIdQuery.map(item => item.id)
    const discussionIdQuery = await Discussion.findAll({ attributes: ['id'],
    raw: true })
    const discussionId = discussionIdQuery.map(item => item.id)
    await queryInterface.bulkInsert('Comments', Array.from({ length: 80 },
      () => ({
        content:falso.randLine({ lineCount:2 }),
        user_id:userId[Math.floor(Math.random() * userId.length)],
        discussion_id:discussionId[Math.floor(Math.random() * discussionId.length)],
        created_at:new Date(),
        updated_at:new Date()
      })
      ))
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('Comments', {})
  }
}
