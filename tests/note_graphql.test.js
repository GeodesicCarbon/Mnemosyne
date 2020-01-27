// ladataan tarvittavat moduulit
const mongoose = require('mongoose')
const supertest = require('supertest')

// ladataan apumoduuli testejä varten
const helper = require('./test_helper')

// Ladataan tarvittavat MongoDB -skeemat
const Note = require('../models/note').default

// Ladataan tarvittava enum
const repeatability = require('../models/note').repeatability

// alustetaan supertestit
const app = require('../app')
const api = supertest(app)

describe('when there are notes already present', () => {
  // alustetaan testitietokanta esimerkkiolioilla ennen jokaista testiä
  beforeEach(async () => {
    await Note.deleteMany({})

    for (let note of helper.initialNotes) {
      let noteObject = new Note(note)
      await noteObject.save()
    }
  })
  test('notes are returned as GrapthQL objects', async () => {
  })
  test('correct number of blogs are returned', async () => {
  })
  test('a specific note is present', async () => {
  })
  test('adding a fully defined note works correctly', async () => {

  })
  test('adding a partially defined note works correctly', async () => {

  })
  test('adding a malformed not fails', async () => {

  })
  test('Adding a new item to the note works correctly', async () => {

  })
  test('Deleting an item from the note works correctly', async () => {

  })
  test('Completing a note item works correctly', async () => {

  })
  test('Uncompleting a note item works correctly', async () => {

  })
  test('Updating note fields works correctly', async () => {

  })
  test('Deleting a note works correctly', async () => {

  })
})
afterAll(() => {
  mongoose.connection.close()
})
