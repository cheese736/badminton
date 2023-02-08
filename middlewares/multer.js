const multer = require('multer')
const upload = multer({ dest: 'temp/', limits: 3000000 })
module.exports = upload
