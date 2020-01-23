// Ladataan tarvittavat konfiguraatioparametrit
const config = require('./utils/config')

// Ladataan tarvittavat moduulit
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

// Ladataan kontrollerit

// Yhdistetään MongoDB-tietokantaan
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true ,
  useFindAndModify: false,
  useCreateIndex: true
})

// Määritellään express-moduuli ja sen middlewaret
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Määritellään tokenin haku -middleware

// Yhdistetään kontrolleri moduuliin

module.exports = app
