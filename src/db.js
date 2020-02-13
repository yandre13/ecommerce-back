const mongoose = require('mongoose')

const connecttDb = (url)=>(
  mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
)

module.exports = {connecttDb}