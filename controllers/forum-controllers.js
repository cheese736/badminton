// eslint-disable-next-line no-unused-vars
const { User, Discussion } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

/* define controll functions */

const forumController = {
  showDiscussion: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    ;(async () => {
    try {
      const discussions = await Discussion.findAndCountAll({ 
        include: [{ model: User }],
        nest: true,
        raw: true,
        limit: limit,
        offset: getOffset(limit, page)
      })
      const pagination = getPagination(limit, page, discussions.count)
      console.log(pagination)
      res.render('forum', { discussions: discussions.rows, pagination }) 
    }
    catch(err) {console.log(err)}
    })()
  }
}

module.exports = forumController