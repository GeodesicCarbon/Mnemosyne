// Ladataan tarvittavat moduulit
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Luodaan mongoose-skeema käyttäjille ja palautetaan siitä malli
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  name: String,
  passwordHash: String,
  notes : [ // Käyttäjän lisäämän muistiinpanoihin viitataan sen mallissa
    {
      note: {
        type: String, //placeholder muistiinpanoskeemalle
        required: true,
        default: 'Test Note'
      }
    }
  ],
})

// Käytetää uniqueValidator-pluginiä jotta validointi tapahtuisi backendissä
// eikä tietokannassa
userSchema.plugin(uniqueValidator, { message: '{VALUE} has already been taken as username. Please select another.' })

// Luodaan funktio joka siivoaa objektin ja palauttaa sen JSON-muodossa
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // never reveal password hash
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)
