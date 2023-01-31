const express = require('express')
const passport = require('../config/passport')
const partyController = require('../controllers/party-controllers')
const router = express.Router()
const userController = require('../controllers/user-controllers')
const forumController = require('../controllers/forum-controllers')
const { authenticated } = require('../middlewares/auth')

// route for normal users
// user controll
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true,
  }),
  userController.signIn
)
router.get('/logout', userController.logout)

router.get('/parties', partyController.showParty)

router.get('/forum/discussions/:discussionId', forumController.showDiscussion)
router.post(
  '/forum/discussions/:discussionId',
  authenticated,
  forumController.postComment
)
router.get('/forum', forumController.showDiscussions)

router.post(
  '/like/discussion/:discussionId/comment/:commentId',
  authenticated,
  forumController.addLike
)

router.delete(
  '/like/discussion/:discussionId/comment/:commentId',
  authenticated,
  forumController.removeLike
)

router.post(
  '/like/discussion/:discussionId',
  authenticated,
  forumController.addLike
)

router.delete(
  '/like/discussion/:discussionId',
  authenticated,
  forumController.removeLike
)

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/news', (req, res) => {
  res.render('index')
})

module.exports = router
