// Ladataan tarvittavat moduulit
const mongoose = require('mongoose')

// Luodaan mongoose-skeema muistiinpanoille ja palautetaan siitä malli
const noteSchema = mongoose.Schema({
  dateCreated: {
    type: Date,
    required: true
  },
  dateDue: {
    type: Date,
    required: true
  }
})
 
// Luodaan funktio joka siivoaa objektin ja palauttaa sen JSON-muodossa
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
