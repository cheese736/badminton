const express= require('express')
const passport = require('../config/passport')
const router = express.Router()
const userController = require('../controllers/user-controllers')



// route for normal users
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/activities', (req, res) => {
  res.render('activities')
})

router.get('/forum', (req, res) => {
  res.render('forum')
})

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/news', (req, res) => {
  res.render('index')
})

module.exports = router