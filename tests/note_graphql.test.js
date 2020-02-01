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
  test('notes are returned as JSON objects', async () => {
    await api
      .post('/graphql')
      .send({ query: '{ allNotes { name } }' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('correct number of blogs are returned', async () => {
    const res = await api
      .post('/graphql')
      .send({ query: '{ allNotes { name } }' })
    expect(res.body.data.allNotes.length).toBe(3)
  })
  test('a specific note is present', async () => {
    const res = await api
      .post('/graphql')
      .send({ query: '{ allNotes { name, noteItems {isDone, itemName} } }' })
    const testNote = helper.initialNotes[0]
    expect(res.body.data.allNotes).toContainEqual({ name: testNote.name, noteItems: testNote.noteItems })
  })
  test('adding a fully defined note works correctly', async () => {
    const newNote = {
      name: 'GQL note',
      dateDue: Date.now() + 10000,
      noteItems: ['Item 1', 'Item 2'],
      noteCategory: 'GQL category',
      noteTags: ['GQL tag1', 'GQL tag2'],
      user: 'GQL User',
      repeatability: repeatability.WEEKLY
    }
    const gqlRequest = `mutation
      {  addNote(
            name: "${newNote.name}",
            dateDue: ${newNote.dateDue},
            noteItems: ${JSON.stringify(newNote.noteItems)},
            noteCategory: "${newNote.noteCategory}",
            noteTags: ${JSON.stringify(newNote.noteTags)},
            user: "${newNote.user}",
            repeatability: "${newNote.repeatability}",
        ) {
          id
          name,
          dateCreated,
          dateDue,
          noteItems{
            id
            itemName,
            isDone
          },
          noteCategory
          noteTags,
          repeatability,
          user
        }}`
    const res = await api
      .post('/graphql')
      .send({ query: gqlRequest })


    const noteReturned = res.body.data.addNote
    noteReturned.dateDue = new Date(noteReturned.dateDue)
    noteReturned.dateCreated = new Date(noteReturned.dateCreated)

    expect(noteReturned.name).toEqual(newNote.name)
    expect(noteReturned.dateDue).toEqual(new Date(newNote.dateDue))
    expect(noteReturned.noteCategory).toEqual(newNote.noteCategory)
    expect(noteReturned.repeatability).toEqual(newNote.repeatability)
    expect(noteReturned.noteItems).toEqual(newNote.noteItems.map(
      (item) => expect.objectContaining({ itemName: item, isDone: false }))
    )
    expect(noteReturned.noteTags).toEqual(expect.arrayContaining(newNote.noteTags))
    const notesInDB = await helper.notesInDB()
    expect(notesInDB).toContainEqual(noteReturned)
  })
  test('adding a partially defined note works correctly', async () => {
    const defaultNote = {
      name: '',
      noteCategory: 'Misc',
      repeatability: repeatability.NEVER,
      user: 'Test User'
    }

    const gqlRequest = `mutation
      {  addNote {
          id
          name,
          dateCreated,
          dateDue,
          noteItems{
            id
            itemName,
            isDone
          },
          noteCategory
          noteTags,
          repeatability,
          user
        }}`

    const res = await api
      .post('/graphql')
      .send({ query: gqlRequest })

    const noteReturned = res.body.data.addNote
    noteReturned.dateCreated = new Date(noteReturned.dateCreated)
    expect(noteReturned).toEqual(expect.objectContaining(defaultNote))

    expect(noteReturned.dateDue).toBe(null)
    delete noteReturned.dateDue

    const notesInDB = await helper.notesInDB()
    expect(notesInDB.length).toBe(helper.initialNotes.length + 1)
    expect(notesInDB).toContainEqual(noteReturned)

  })
  // test('adding a malformed not fails', async () => {
  //
  // })
  // test('Adding a new item to the note works correctly', async () => {
  //
  // })
  // test('Deleting an item from the note works correctly', async () => {
  //
  // })
  // test('Completing a note item works correctly', async () => {
  //
  // })
  // test('Uncompleting a note item works correctly', async () => {
  //
  // })
  // test('Updating note fields works correctly', async () => {
  //
  // })
  // test('Deleting a note works correctly', async () => {
  //
  // })
})
afterAll(() => {
  mongoose.connection.close()
})
