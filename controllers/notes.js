// ladataan tarvittavat moduulit
const notesRouter = require('express').Router()
// ladataan muistiinpanojen MongoDB-skeema
const Note = require('../models/note').default
// Ladataan virheidenhallinnan middleware

// --- Määritellään reitit ---
// Palautetaan tallennetut muistiinpanot
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

module.exports = notesRouter
