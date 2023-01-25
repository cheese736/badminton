const bcrypt = require('bcryptjs')
const { User } = require('../models')

/* define controll functions */
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  }, 

  signUp:  (req, res) => {
    console.log(req.body)
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match')
    ;(async () => {
      try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) throw new Error('Email already exist')
        const hash = await bcrypt.hash(req.body.password, 10)
        await User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
        req.flash('success_messages','成功註冊帳號')
        res.redirect('/signin')
      }
      catch (err) {
        console.log(err) 
      } 
    })()
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    console.log(req.user)
    res.redirect('/')
  },
  logout: () => {},
  getUser: () => {},
  editUser: () => {},
  putUser: () => {},
}

module.exports = userController