const express = require('express')
const passport = require('../config/passport')
const partyController = require('../controllers/party-controllers')
const router = express.Router()
const userController = require('../controllers/user-controllers')
const forumController = require('../controllers/forum-controllers')
const { authenticated } = require('../middlewares/auth')
const upload = require('../middlewares/multer')

// route for normal users
// third-party-login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)
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
router.put(
  '/users/:userId',
  authenticated,
  upload.single('avatar'),
  userController.putUser
)
router.get('/users/:userId/edit', authenticated, userController.editUser)
router.get('/users/:userId', authenticated, userController.getUser)

router.get('/logout', userController.logout)

router.get('/parties', partyController.showParty)

// ./forum
router.get('/discussions/:discussionId', forumController.showDiscussion)

router.post('/discussions', authenticated, forumController.postDiscussion)
router.post(
  '/discussions/:discussionId',
  authenticated,
  forumController.postComment
)

router.post(
  '/discussions/:discussionId/comment/:commentId',
  authenticated,
  forumController.addLike
)

router.delete(
  '/discussions/:discussionId/comment/:commentId/removelike',
  authenticated,
  forumController.removeLike
)

router.post(
  '/discussions/:discussionId/like',
  authenticated,
  forumController.addLike
)

router.delete(
  '/discussions/:discussionId/removelike',
  authenticated,
  forumController.removeLike
)

router.get('/discussions', forumController.showDiscussions)

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/news', (req, res) => {
  res.render('index')
})

module.exports = router
