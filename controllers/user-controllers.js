const bcrypt = require('bcryptjs')
const { User, City } = require('../models')
const dayjs = require('dayjs')
const { localFileHandler } = require('../helpers/file-helpers')
const { Op } = require('sequelize')

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
      const fanId = req.params.userId
      ;(async () => {
        const fan = await User.findOne({
          include: [City],
          where: { id: fanId },
          raw: true,
          nest: true,
        })
        fan.createdAt = dayjs(fan.createdAt).format('YYYY-MM-DD')
        res.render('users', { fan })
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
        const cities = await City.findAll({
          raw: true,
        })
        user.createdAt = dayjs(user.createdAt).format('YYYY-MM-DD')
        res.render('edit', { user, cities })
      })()
    } catch (err) {
      console.log(err)
    }
  },
  putUser: (req, res, next) => {
    const file = req.file
    const userId = req.user.id
    const { name, email, city } = req.body
    if (!name && email) throw new Error('Invalid input')
    if (userId !== Number(req.params.userId)) throw new Error('Permission deny')
    try {
      (async () => {
        // handling image file if exist
        const emailExist = await User.findOne({
          where: { id: { [Op.ne]: userId }, email },
        })
        if (emailExist) {
          throw new Error('Email has been used')
        }
        const path = await localFileHandler(file)
        const user = await User.findByPk(userId)
        user.update({
          name,
          email,
          city,
          avatar: path || user.avatar,
        })

        req.flash('success_messages', '資料更新成功')
        res.redirect(`/users/${userId}`)
        return
      })()
    } catch (err) {
      req.flash('error_messages', 'email已被使用')
      res.redirect(`/users/${userId}/edit`)
      next(err)
      console.log(err)
      throw err
    }
  },
}

module.exports = userController
