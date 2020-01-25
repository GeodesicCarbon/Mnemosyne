// ladataan tarvittavat moduulit
const mongoose = require('mongoose')

// ladataan apumoduuli testejä varten
const helper = require('./test_helper')

// Ladataan tarvittavat MongoDB -skeemat
const { Note, repeatability } = require('../models/note')
const User = require('../models/user')
const Category = require('../models/category')
const Tag = require('../models/tag')

describe('when adding notes to the database', () => {
  // alustetaan testitietokanta ennen jokaista testiä
  beforeEach(async () => {
    await Note.deleteMany({})
  })
  describe('notes are added correctly', async () => {
    const testTime = Date.now()
    for (let note of helper.initialNotes) {
      let noteObject = new Note(note)
      await noteObject.save()
    }
    test('correct number of notes are present', async () => {
      const notes = await helper.notesInDB()
      expect(notes.length).toBe(2)
    })
    test('fully defined note is added correctly', async () => {
      const notes = await helper.notesInDB()
      expect(notes[0]).toBeDefined()
      expect(notes[0]).toEqual(helper.initialNotes[0])
    })
    test('noteItems are added correctly', async () => {
      const notes = await helper.notesInDB()
      const note = notes[1]
      expect(note.noteItems).toEqual(helper.initialNotes[1])
    })
    test('Partially defined note to have default values', async () => {
      const notes = await helper.notesInDB()
      const savedDefaultNote = notes[2]
      const partialNote = Object.assign({}, savedDefaultNote)
      partialNote.name = ''
      partialNote.repeatability = repeatability.NEVER
      partialNote.user = 'Test User'
      partialNote.noteCategory = 'Misc'
      const timeElapsed = Date.now()
      expect(savedDefaultNote).toBeDefined()
      expect(savedDefaultNote.dateCreated - testTime).toBeLessThanOrEqual(timeElapsed)
      delete savedDefaultNote.dateCreated
      expect(savedDefaultNote).toEqual(partialNote)
    })
    test('Adding malformed note fails validation', async () => {
      const malformNote = {
        name: null,
        dateCreated: null,
        dateDue: null,
        noteItems: [null],
        noteCategory: null,
        noteTags: [null],
        repeatability: 'INCORRECT ENUM',
        user: null
      }
      expect(new Note(malformNote)).toThrow() // TODO: add all validation errors so each one is tested
    })
  })
})
describe('when adding notes to the database', () => {
  // alustetaan testitietokanta esimerkkiolioilla ennen jokaista testiä
})
describe('when adding notes to the database', () => {
  // alustetaan testitietokanta esimerkkiolioilla ennen jokaista testiä
})
describe('when adding notes to the database', () => {
  // alustetaan testitietokanta esimerkkiolioilla ennen jokaista testiä
})
afterAll(() => {
  mongoose.connection.close()
})
