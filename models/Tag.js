// Ladataan tarvittavat moduulit
const mongoose = require('mongoose')

// Luodaan mongoose-skeema muistiinpanokategorioille ja palautetaan siitä malli
const tagSchema = mongoose.Schema({
  tag: {
    type: String,
    required: true
  }
})

// Luodaan funktio joka siivoaa objektin ja palauttaa sen JSON-muodossa
tagSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Tag', tagSchema)
