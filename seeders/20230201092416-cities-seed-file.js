'use strict'
const cities = [
  '台北',
  '桃園',
  '新竹',
  '苗栗',
  '台中',
  '南投',
  '彰化',
  '雲林',
  '嘉義',
  '台南',
  '高雄',
  '屏東',
  '台東',
  '花蓮',
  '宜蘭',
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.bulkInsert(
      'Cities',
      cities.map((city) => {
        return {
          name: city,
          created_at: new Date(),
          updated_at: new Date(),
        }
      })
    )
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('Cities', {})
  },
}
