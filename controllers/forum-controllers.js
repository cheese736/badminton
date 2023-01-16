// eslint-disable-next-line no-unused-vars
const { User, Discussion, Category, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

/* define controll functions */

const forumController = {
  showDiscussions: (req, res) => {
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
  },

  showDiscussion: (req, res) => {
    try {
      const id = Number(req.params.discussionId)
      ;(async () => {
        const discussion = await Discussion.findOne({
          where: { id },
          raw: true
        })
        console.log(discussion)
        const comments = await Comment.findAll(
          {
            where:{ discussion_id: id },
            raw: true
          }
        )
        res.render('discussions', { comments, discussion })
      })()
    }
    catch(err) {console.log(err)}
  },

  postComment: (req, res) => {
    try {
      const { comment } = req.body
      const id = Number(req.params.discussionId)
      if (comment.trim() === '') throw new Error('empty string not allowed')
      ;(async() => {
        const discussion = await Discussion.findOne({
          where: { id },
          raw: true
        })
        await Comment.create({
          content: comment,
          user_id: 128,
          discussion_id:id,
          created_at: Date.now(),
          updated_at: Date.now()
        })
        const comments = await Comment.findAll(
          {
            where:{ discussion_id: id },
            raw: true
          }
        )
        res.render('discussions', { comments, discussion })
      })()
    }
    catch(err) {console.log(err)}
  }
}

module.exports = forumController