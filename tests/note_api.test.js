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
  test('notes are returned as json objects', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body.length).toBe(helper.initialNotes.length)
  })
})
afterAll(() => {
  mongoose.connection.close()
})
