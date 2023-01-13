// eslint-disable-next-line no-unused-vars
const { User, Discussion, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

/* define controll functions */

const forumController = {
  showDiscussion: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const category = req.query.category || false
    console.log(category)
    ;(async () => {
    try {
      const { id: category_id } = await Category.findOne({
        attribute: ['id'],
        where: category ? { name: category } : {},
        raw: true
      })
      console.log(category_id)
      const discussions = await Discussion.findAndCountAll({ 
        include: Category,
        nest: true,
        raw: true,
        limit: limit,
        offset: getOffset(limit, page),
        where: (category && category_id) ? { category_id } : {}
      })
      const pagination = getPagination(limit, page, discussions.count)
      res.render('forum', { discussions: discussions.rows, pagination }) 
    }
    catch(err) {console.log(err)}
    })()
  }
}

module.exports = forumController