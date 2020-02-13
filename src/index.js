require('dotenv').config()
require('./db').connecttDb(process.env.DATABASE).then(console.log('DB connected'))
const app = require('./app'),
 c = console.log


app.listen(app.get('port'), ()=>c(`Server on port ${app.get('port')}`))