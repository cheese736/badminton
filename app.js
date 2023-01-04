const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const app = express()


const port = 3000

app.engine('hbs', handlebars({ extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))


app.get('/activities', (req, res, next) => {
  res.render('activities')
})

app.get('/forum', (req, res, next) => {
  res.render('forum')
})

app.get('/', (req, res, next) => {
  res.render('index')
})

app.use(routes)

app.listen(port, () => {
  console.info(`App listening on port ${port}!`)
})