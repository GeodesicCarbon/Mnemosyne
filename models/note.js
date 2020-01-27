// Ladataan tarvittavat moduulit
const mongoose = require('mongoose')

// Luodaan Enum eri toistotyypeille
const repeatability = {
  NEVER: 'never',
  ONCE: 'once',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  BIANNUAL: 'biannual',
  YEARLY: 'yearly'
}

// Luodaan mongoose-skeema muistiinpanoille ja palautetaan siitä malli
const noteSchema = mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateDue: {
    type: Date,
  },
  noteItems: [{
    itemName: {
      type: String,
      required: true
    },
    isDone: {
      type: Boolean,
      required: true,
      default: false,
    }
  }],
  noteCategory: {
    type: String, // placeholder Category-skeemalle
    required: true,
    default: 'Misc'
  },
  noteTags: [{
    type: String, // placeholder Tag-skeemalle
    required: true
  }],
  repeatability: {
    type: String,
    enum: Object.values(repeatability),
    required: true,
    default: repeatability.NEVER
  },
  user: {
    type: String, //placeholder käyttäjäskeemalle
    required: true,
    default: 'Test User'
  }
})

// Luodaan funktio joka siivoaa objektin ja palauttaa sen JSON-muodossa
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    for (const item of returnedObject.noteItems) {
      item.id = item._id.toString()
      delete item._id
    }
  }
})

module.exports = {
  default: mongoose.model('Note', noteSchema),
  repeatability
}
