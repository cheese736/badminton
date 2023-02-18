// eslint-disable-next-line no-unused-vars
const { User, Discussion, Category, Comment, Like } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')
const {
  viewsCompareFn,
  commentsCompareFn,
} = require('../helpers/sorting-helpers')
const sequelize = require('sequelize')
const op = sequelize.Op
/* define controll functions */

const forumController = {
  showDiscussions: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const category = req.query.category || false
    ;(async () => {
      try {
        const { id: category_id } = await Category.findOne({
          attribute: ['id'],
          where: category ? { name: category } : {},
          raw: true,
        })
        let discussions = await Discussion.findAndCountAll({
          include: [Category, User],
          nest: true,
          raw: true,
          limit: limit,
          offset: getOffset(limit, page),
          where: category && category_id ? { category_id } : {},
        })
        // const comments = await Comment.findAll({
        //   include: { model: User },
        //   attributes: [
        //     'discussion_id',
        //     [
        //       sequelize.fn('MAX', sequelize.col('comment.id')),
        //       'latestCommentId',
        //     ],
        //     [sequelize.col('comment.id'), 'latestCommentId'],
        //     sequelize.col('comment.content'),
        //     ['user_id', 'userId'],
        //     ['created_at', 'createdAt'],
        //     [sequelize.col('user.name'), 'userName'],
        //   ],
        //   group: ['discussion_id'],
        //   order: [['id', 'DESC']],
        //   raw: true,
        //   nest: true,
        //   limit: 10,
        // })

        const comments = await Comment.findAll({
          include: { model: User },
          attributes: [
            'discussion_id',
            [sequelize.col('comment.id'), 'latestCommentId'],
            ['user_id', 'userId'],
            [sequelize.col('user.name'), 'userName'],
            ['created_at', 'createdAt'],
          ],
          where: {
            id: {
              [op.in]: sequelize.literal(
                '(SELECT MAX(id) FROM comments GROUP BY discussion_id)'
              ),
            },
          },
          raw: true,
          nest: true,
        })

        const commentCounts = await Comment.findAll({
          include: { model: Discussion },
          attributes: [
            'discussion_id',
            [
              sequelize.fn('COUNT', sequelize.col('comment.id')),
              'numberOfComments',
            ],
          ],
          group: 'discussion_id',
          raw: true,
          nest: true,
        })

        // 將取得的discussion加上最後評論的相關資訊
        discussions.rows = discussions.rows.map((item) => {
          const latestComment = comments.find(
            (comment) => comment.discussion_id === item.id
          )
          const count = commentCounts.find(
            (result) => result.discussion_id === item.id
          )
          if (latestComment) {
            item.latestComment = latestComment.content
            item.commentedTime = latestComment.createdAt
            item.latestCommenter = latestComment.userName
            item.commenterId = latestComment.userId
            item.numberOfComments = count.numberOfComments
          }
          return item
        })
        const topViewedDis = [...discussions.rows]
          .sort(viewsCompareFn)
          .slice(0, 5)
        const topCommentedDis = [...discussions.rows]
          .sort(commentsCompareFn)
          .slice(0, 5)
        const pagination = getPagination(limit, page, discussions.count)
        res.render('forum', {
          discussions: discussions.rows,
          pagination,
          topViewedDis,
          topCommentedDis,
        })
      } catch (err) {
        console.log(err)
      }
    })()
  },
  showDiscussion: (req, res) => {
    // get discussionId from URL parameters
    const discussion_id = Number(req.params.discussionId)
    // views +1 nomatter the client is a website member
    Discussion.findOne({ where: { id: discussion_id } }).then((i) =>
      i.increment('views')
    )
    // get userId if exist
    const user_id = req.user ? req.user.id : null
    ;(async () => {
      try {
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
      } catch (e) {
        console.log(e)
      }
    })()
  },

  postComment: (req, res) => {
    const userId = req.user.id
    const { comment } = req.body
    const id = Number(req.params.discussionId)
    if (comment.trim() === '') throw new Error('empty string not allowed')
    ;(async () => {
      try {
        await Comment.create({
          content: comment,
          user_id: userId,
          discussion_id: id,
          created_at: Date.now(),
          updated_at: Date.now(),
        })
        res.redirect(`/forum/discussions/${id}`)
      } catch (e) {
        console.log(e)
      }
    })()
  },

  addLike: (req, res) => {
    const user_id = req.user.id
    const discussion_id = Number(req.params.discussionId)
    const comment_id = Number(req.params.commentId) || 0
    ;(async () => {
      try {
        await Like.create({
          user_id,
          discussion_id,
          comment_id,
        })
        res.redirect(`/forum/discussions/${discussion_id}`)
      } catch (e) {
        console.log(e)
      }
    })()
  },

  removeLike: (req, res) => {
    const user_id = req.user.id
    const discussion_id = Number(req.params.discussionId)
    const comment_id = Number(req.params.commentId) || 0
    ;(async () => {
      try {
        Like.destroy({
          where: {
            user_id,
            discussion_id,
            comment_id,
          },
        })
        res.redirect(`/forum/discussions/${discussion_id}`)
      } catch (e) {
        console.log(e)
      }
    })()
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
