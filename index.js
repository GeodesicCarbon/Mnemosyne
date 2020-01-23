// ladataan varsinainen sovellus
const app = require('./app')
// Ladataan tarvittavat moduulit
const http = require('http')
// Ladataan konfiguraatiot
const config = require('./utils/config')

// luodaan http-palvelin
const server = http.createServer(app)

// käynnistetään palvelin
server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
