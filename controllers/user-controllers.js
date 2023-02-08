const bcrypt = require('bcryptjs')
const { User, City } = require('../models')
const dayjs = require('dayjs')
const { localFileHandler } = require('../helpers/file-helpers')

/* define controll functions */
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error('Passwords do not match')
    ;(async () => {
      try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) throw new Error('Email already exist')
        const hash = await bcrypt.hash(req.body.password, 10)
        await User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
        req.flash('success_messages', '成功註冊帳號')
        res.redirect('/signin')
      } catch (err) {
        console.log(err)
      }
    })()
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/')
  },
  getUser: (req, res) => {
    try {
      const userId = req.params.userId
      ;(async () => {
        const user = await User.findOne({
          include: [City],
          where: { id: userId },
          raw: true,
          nest: true,
        })
        user.createdAt = dayjs(user.createdAt).format('YYYY-MM-DD')
        res.render('users', { user })
      })()
    } catch (err) {
      console.log(err)
    }
  },
  editUser: (req, res) => {
    try {
      const userId = req.user.id
      ;(async () => {
        const user = await User.findOne({
          include: [City],
          where: { id: userId },
          raw: true,
          nest: true,
        })
        user.createdAt = dayjs(user.createdAt).format('YYYY-MM-DD')
        res.render('edit', { user })
      })()
    } catch (err) {
      console.log(err)
    }
  },
  putUser: (req, res) => {
    try {
      if (req.file) {
        const file = req.file
        const userId = req.user.id
        ;(async () => {
          const path = await localFileHandler(file)
          await User.update({ avatar: path }, { where: { id: userId } })
          req.flash('success_messages', '圖片上傳成功')
          res.redirect(`/users/${userId}`)
        })()
      }
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = userController
