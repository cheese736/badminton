// eslint-disable-next-line no-unused-vars
const { User, Discussion, Category, Comment, Like } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

/* define controll functions */

const forumController = {
  showDiscussions: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const category = req.query.category || false
    // console.log(category)
    ;(async () => {
      try {
        const { id: category_id } = await Category.findOne({
          attribute: ['id'],
          where: category ? { name: category } : {},
          raw: true,
        })
        // console.log(category_id)
        const discussions = await Discussion.findAndCountAll({
          include: [Category, User],
          nest: true,
          raw: true,
          limit: limit,
          offset: getOffset(limit, page),
          where: category && category_id ? { category_id } : {},
        })
        const pagination = getPagination(limit, page, discussions.count)
        res.render('forum', { discussions: discussions.rows, pagination })
      } catch (err) {
        console.log(err)
      }
    })()
  },

  showDiscussion: (req, res) => {
    try {
      // get discussionId from URL parameters
      const discussion_id = Number(req.params.discussionId)
      // get userId if exist
      const user_id = req.user ? req.user.id : null
      ;(async () => {
        let likedThings =
          (await Like.findAll({
            attributes: ['comment_id'],
            where: {
              user_id,
              discussion_id,
            },
            raw: true,
          })) || []
        likedThings = likedThings.map((el) => el.comment_id)
        console.log(likedThings)
        const discussion = await Discussion.findOne({
          include: { model: User },
          where: { id: discussion_id },
          raw: true,
          nest: true,
        })

        const comments = await Comment.findAll({
          include: { model: User },
          where: { discussion_id },
          raw: true,
          nest: true,
        })
        res.render('discussions', { comments, discussion, likedThings })
      })()
    } catch (err) {
      console.log(err)
    }
  },

  postComment: (req, res) => {
    try {
      const userId = req.user.id
      const { comment } = req.body
      const id = Number(req.params.discussionId)
      if (comment.trim() === '') throw new Error('empty string not allowed')
      ;(async () => {
        await Comment.create({
          content: comment,
          user_id: userId,
          discussion_id: id,
          created_at: Date.now(),
          updated_at: Date.now(),
        })
        res.redirect(`/forum/discussions/${id}`)
      })()
    } catch (err) {
      console.log(err)
    }
  },

  addLike: (req, res) => {
    try {
      const user_id = req.user.id
      const discussion_id = Number(req.params.discussionId)
      const comment_id = Number(req.params.commentId) || 0
      ;(async () => {
        await Like.create({
          user_id,
          discussion_id,
          comment_id,
        })
        res.redirect(`/forum/discussions/${discussion_id}`)
      })()
    } catch (err) {
      console.log(err)
    }
  },

  removeLike: (req, res) => {
    try {
      const user_id = req.user.id
      const discussion_id = Number(req.params.discussionId)
      const comment_id = Number(req.params.commentId) || 0
      ;(async () => {
        Like.destroy({
          where: {
            user_id,
            discussion_id,
            comment_id,
          },
        })
      })()
      res.redirect(`/forum/discussions/${discussion_id}`)
    } catch (err) {
      console.log(err)
    }
  },

  // likeComment: (req, res) => {
  //   try {
  //     const userId = req.user.id
  //     const id = Number(req.params.commentId)
  //     ;(async () => {
  //       await Like.create({
  //         user_id: userId,
  //         comment_id: id,
  //       })
  //       res.redirect(`/forum/discussions/${id}`)
  //     })()
  //   } catch (err) {
  //     console.log(err)
  //   }
  // },
}

module.exports = forumController
