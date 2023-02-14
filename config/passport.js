const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// set up Passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    // authenticate user
    (req, email, password, cb) => {
      User.findOne({ where: { email } }).then((user) => {
        if (!user)
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！')
          )
        bcrypt.compare(password, user.password).then((res) => {
          if (!res)
            return cb(
              null,
              false,
              req.flash('error_messages', '帳號或密碼輸入錯誤！')
            )
          return cb(null, user)
        })
      })
    }
  )
)

// facebook login
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['emails', 'displayName', 'photos'],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile)
    }
  )
)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then((user) => {
      cb(null, user.toJSON())
    })
    .catch((err) => cb(err))
})

module.exports = passport
