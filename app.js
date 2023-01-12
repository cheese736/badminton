const express = require('express')
const session = require('express-session')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const passport = require('passport')
const routes = require('./routes')
const app = express()
const handlebarsHelpers = require('./helpers/handlebars-helpers')

const port = 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`App listening on port ${port}!`)
})