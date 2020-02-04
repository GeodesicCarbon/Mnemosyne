// ladataan tarvittavat moduulit
const mongoose = require('mongoose')
const supertest = require('supertest')

// ladataan apumoduuli testejä varten
const helper = require('./test_helper')

// Ladataan tarvittavat MongoDB -skeemat
const Category = require('../models/category')


// alustetaan supertestit
const app = require('../app')
const api = supertest(app)

describe('when there are categories already present', () => {
  // alustetaan testitietokanta esimerkkiolioilla ennen jokaista testiä
  beforeEach(async () => {
    await Category.deleteMany({})

    for (let category of helper.initialCategories) {
      let categoryObject = new Category(category)
      await categoryObject.save()
    }
  })

  test('categories are returned as JSON objects', async () => {
    await api
      .post('/graphql')
      .send({ query: '{ allCategories { name } }' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // test('correct number of blogs are returned', async () => {
  //
  // })
  //
  // test('a specific category is present', async () => {
  // })
  //
  // test('adding a fully defined category works correctly', async () => {
  //
  // })
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
