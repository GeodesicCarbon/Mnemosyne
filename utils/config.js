// ladataan parametrit .env -tiedostosta
require('dotenv').config()

// Määritellään parametrimuuttujat ja palautetaan ne
let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// Määritellään testiympäristölle oma tietokanta
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

// Määritellään tietokanta CI:lle
if (process.env.CI === 'true') {
  MONGODB_URI = process.env.CI_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT
}
