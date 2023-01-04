const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp:  () => {},
  signInPage: () => {},
  signIn: () => {},
  logout: () => {},
  getUser: () => {},
  editUser: () => {},
  putUser: () => {},
}

module.exports = userController