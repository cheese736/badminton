const express = require('express')
const handlebars = require('express-handlebars')

const app = express()

const port = 3000

app.engine('hbs', handlebars({ extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.get('/', (req, res, next) => {
  res.render('index')
})

app.listen(port, () => {
  console.info(`App listening on port ${port}!`)
})