// ladataan tarvittavat moduulit
const mongoose = require('mongoose')
const supertest = require('supertest')

// ladataan apumoduuli testejä varten
const helper = require('./test_helper')

// Ladataan tarvittavat MongoDB -skeemat
const Category = require('../models/category')
const Note = require('../models/note').default

// alustetaan supertestit
const app = require('../app')
const api = supertest(app)

describe('when there are categories already present', () => {
  // alustetaan testitietokanta esimerkkiolioilla ennen jokaista testiä
  beforeEach(async () => {
    await Category.deleteMany({})
    await Note.deleteMany({})

    for (let category of helper.initialCategories) {
      let categoryObject = new Category(category)
      await categoryObject.save()
    }
    const categories = await helper.categoriesInDB()
    const category = await Category.findById(categories[0].id)
    const note = new Note(helper.initialNotes[0])
    await note.save()

    category.notes = [note._id]
    await category.save()
  })

  test('categories are returned as JSON objects', async () => {
    await api
      .post('/graphql')
      .send({ query: '{ allCategories { name } }' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of categories are returned', async () => {
    const res = await api
      .post('/graphql')
      .send({ query: '{ allCategories { name } }' })

    expect(res.body.data.allCategories.length).toBe(2)
  })

  test('a specific category is present', async () => {
    const category = helper.initialCategories[0]
    const notes = await helper.notesInDB()
    const res = await api
      .post('/graphql')
      .send({ query: '{ allCategories { id, name, notes { id, name } } }' })

    const returnedCategory = res.body.data.allCategories[0]
    returnedCategory.notes = returnedCategory.notes.map(note => note.name)
    expect(returnedCategory.name).toEqual(category.name)
    expect(returnedCategory.notes).toEqual([notes[0].name])

    returnedCategory.notes = returnedCategory.notes.map(() => notes[0].id.toString())
    const categories = await helper.categoriesInDB()
    expect(categories[0]).toEqual(returnedCategory)
  })

  test('adding a fully defined category works correctly', async () => {
    const note = new Note(helper.initialNotes[1])
    await note.save()

    const newCatName = 'GQL test category'

    const gqlRequest = `mutation
      {  addCategory(
            name: "${newCatName}",
            notes: ["${note._id}"]
        ) {
          id
          name,
          notes {
            id,
            name
          }
        }}`
    const res = await api
      .post('/graphql')
      .send({ query: gqlRequest })
    const returnedCategory = res.body.data.addCategory

    expect(returnedCategory.id).toBeDefined()
    expect(returnedCategory.name).toBe(newCatName)
    expect(returnedCategory.notes).toEqual([{ name: note.name, id: note.id }])

    returnedCategory.notes = returnedCategory.notes.map(() => note.id)
    const categories = await helper.categoriesInDB()
    expect(categories).toContainEqual(returnedCategory)
  })
  //
  // test('adding a partially defined category works correctly', async () => {
  //
  // })
  //
  // test('adding a malformed category fails', async () => {
  //
  // })
  //
  // test('Adding a new note to the category works correctly', async () => {
  //
  // })
  //
  // test('Adding a note to the non-existent category throws error', async () => {
  //
  // })
  //
  // test('Deleting an note from the category works correctly', async () => {
  //
  // })
  //
  // test('Deleting an note from non-existent category throws error', async () => {
  //
  // })
  //
  // test('Deleting a category works correctly', async () => {
  //
  // })
})

afterAll(() => {
  mongoose.connection.close()
})
