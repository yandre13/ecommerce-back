const express = require('express'),
 router = require('./routes'),
 expressValidator = require('express-validator'),
 cors = require('cors'),
 fileUpload = require('express-fileupload'),
 app = express()

 //Config and Middlewares
app
.set('port', process.env.PORT || 3002)
.use(cors())
.use(express.json())
.use(express.urlencoded({extended: false}))
.use(expressValidator())
.use(fileUpload())
.use('/api/v1', router)
//Statics
.use(express.static(`${__dirname}/public`))


module.exports = app