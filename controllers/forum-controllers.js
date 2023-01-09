// eslint-disable-next-line no-unused-vars
const { User, Discussion } = require('../models')

/* define controll functions */

const forumController = {
  showDiscussion: (req, res) => {
    (async () => {
    try {
      const discussions = await Discussion.findAll({ raw: true })
      res.render('forum', { discussions }) 
    }
    catch(err) {console.log(err)}
    })()
  }
}

module.exports = forumController