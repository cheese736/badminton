const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const GoogleStrategy = require('passport-google-oauth20')
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
      try {
        const { name, email, picture } = profile._json
        ;(async () => {
          let user = await User.findOne({
            where: { email },
          })
          if (user) return done(null, user)
          const randomPassword = Math.random().toString(36).slice(-8)
          const salt = await bcrypt.genSalt(10)
          const password = await bcrypt.hash(randomPassword, salt)
          user = await User.create({
            name,
            email,
            password,
            avatar: picture.data.url,
          })
          return done(null, user)
        })()
      } catch (e) {
        console.log(e)
      }
    }
  )
)

// google login
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      profileFields: ['emails', 'displayName', 'photos'],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      try {
        const { name, email, picture } = profile._json
        ;(async () => {
          let user = await User.findOne({
            where: { email },
          })
          if (user) return done(null, user)
          const randomPassword = Math.random().toString(36).slice(-8)
          const salt = await bcrypt.genSalt(10)
          const password = await bcrypt.hash(randomPassword, salt)
          user = await User.create({
            name,
            email,
            password,
            avatar: picture,
          })
          return done(null, user)
        })()
      } catch (e) {
        console.log(e)
      }
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
