// Ladataan tarvittavat konfiguraatioparametrit
const config = require('./utils/config')

// Ladataan tarvittavat moduulit
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const _ = require('lodash')
const { ApolloServer } = require('apollo-server-express')

// Ladataan kontrollerit
const notesRouter = require('./controllers/notes')

// Ladataan GraphQL-skeemat
const notesTypedef = require('./typedefs/notes')
const rootTypedef = require('./typedefs/root')

// Ladataan GraphQL-resolverit
const notesResolver = require('./resolvers/notes')

// Yhdistetään MongoDB-tietokantaan
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true ,
  useFindAndModify: false,
  useCreateIndex: true
})

// Luodaan yhtenäinen GraphQL-skeema
const typeDefs = [rootTypedef, notesTypedef]
// Yhdistetään GraphQL-resolverit
const resolvers = [_.merge(notesResolver, {})]
// luodaan Apollo-palvelin
const apollo = new ApolloServer({
  typeDefs,
  resolvers
})
// Määritellään express-moduuli ja sen middlewaret
const app = express()

app.use(cors())
app.use(bodyParser.json())

// Määritellään Apollo-middleware
apollo.applyMiddleware({ app })
// Määritellään tokenin haku -middleware

// Yhdistetään kontrolleri moduuliin
app.use('/api/notes', notesRouter)

module.exports = app
