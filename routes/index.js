const express= require('express')
const router = express.Router()
const userController = require('../controllers/user-controllers')



// route for normal users
router.get('/users/signup', userController.signUpPage)


router.get('/activities', (req, res, next) => {
  res.render('activities')
})

router.get('/forum', (req, res, next) => {
  res.render('forum')
})

router.get('/', (req, res, next) => {
  res.render('news')
})

router.get('/news', (req, res) => {
  res.render('news')
})

console.log(router)
console.log('123')

module.exports = router