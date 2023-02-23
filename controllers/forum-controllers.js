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
        // 檢查請求中是否含有類別過濾
        const { id: category_id } = await Category.findOne({
          attribute: ['id'],
          where: category ? { name: category } : {},
          raw: true,
        })

        const categories = await Category.findAll({ raw: true })

        //  分頁參數
        const pagParams = {
          limit: limit, //每頁顯示筆數
          offset: getOffset(limit, page), //起始筆數
          where: category && category_id ? { category_id } : {}, //類別過濾
          raw: true,
          order: [['id', 'DESC']],
        }
        // 取得當前頁面
        const currentPageDiscussions = await Discussion.findAndCountAll({
          include: { model: User },
          nest: true,
          ...pagParams,
        })

        // 取得每篇Discussion的最後留言資訊
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
                // 以discussionId為組，取`comment`.`id`數最大的作為最新留言
                '(SELECT MAX(id) FROM comments GROUP BY discussion_id)'
              ),
            },
          },
          raw: true,
          nest: true,
        })

        // 取得每篇Discussion的comment數
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

        // 將取得的discussion加上最後評論的相關資訊(當前頁面)
        currentPageDiscussions.rows = currentPageDiscussions.rows.map(
          (item) => {
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
            } else {
              item.numberOfComments = 0
            }
            return item
          }
        )

        const pagination = getPagination(
          limit,
          page,
          currentPageDiscussions.count
        )

        // 處理熱門討論
        const allDiscussions = await Discussion.findAll({
          include: [Category, User],
          nest: true,
          raw: true,
        })

        const topViewedDis = [...allDiscussions]
          .sort(viewsCompareFn)
          .slice(0, 5)

        const topCommentedDis = [...allDiscussions]
          .sort(commentsCompareFn)
          .slice(0, 5)

        topCommentedDis.forEach((discussion) => {
          const count = commentCounts.find(
            (result) => result.discussion_id === discussion.id
          )
          discussion.numberOfComments = count.numberOfComments || 0
        })

        res.render('forum', {
          discussions: currentPageDiscussions.rows,
          pagination,
          topViewedDis,
          topCommentedDis,
          categories,
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
  postDiscussion: (req, res) => {
    const userId = req.user.id
    const { header, content, category } = req.body
    ;(async () => {
      try {
        await Discussion.create({
          header,
          content,
          user_id: userId,
          category_id: category,
          created_at: Date.now(),
          updated_at: Date.now(),
        })
        res.redirect('/discussions')
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
}

module.exports = forumController
