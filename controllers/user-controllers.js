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
    const fanId = req.params.userId
    ;(async () => {
      try {
        const fan = await User.findOne({
          include: [City],
          where: { id: fanId },
          raw: true,
          nest: true,
        })
        fan.createdAt = dayjs(fan.createdAt).format('YYYY-MM-DD')
        res.render('users', { fan })
      } catch (e) {
        console.log(e)
      }
    })()
  },
  editUser: (req, res) => {
    const userId = req.user.id
    ;(async () => {
      try {
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
      } catch (e) {
        console.log(e)
      }
    })()
  },
  putUser: (req, res) => {
    const file = req.file
    const userId = req.user.id
    const { name, email, city } = req.body
    if (!name && email) throw new Error('Invalid input')
    if (userId !== Number(req.params.userId)) throw new Error('Permission deny')
    ;(async () => {
      try {
        const emailExist = await User.findOne({
          where: { id: { [Op.ne]: userId }, email },
        })
        if (emailExist) {
          throw new Error('Email has been used')
        }
        // handling image file if exist
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
      } catch (e) {
        console.log(e)
        req.flash('error_messages', e.message)
        res.redirect(`/users/${userId}`)
      }
    })()
  },
}

module.exports = userController
