const express = require('express')
const session = require('express-session')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('passport')
const { getUser } = require('./helpers/auth-helpers')

const app = express()
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') })
}
const port = process.env.PORT || 3000
const routes = require('./routes')
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    store: '',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`App listening on port ${port}!`)
})
