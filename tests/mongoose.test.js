// ladataan tarvittavat moduulit
const mongoose = require('mongoose')

// ladataan apumoduuli testejä varten
const helper = require('./test_helper')

// Ladataan tarvittavat MongoDB -skeemat
const { Note, repeatability } = require('../models/note')
const User = require('../models/user')
const Category = require('../models/category')
const Tag = require('../models/tag')

// --- Note ---
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
      expect(notes.length).toBe(3)
    })
    test('fully defined note is added correctly', async () => {
      const notes = await helper.notesInDB()
      expect(notes[0]).toBeDefined()
      expect(notes[0]).toEqual(helper.initialNotes[0])
    })
    test('noteItems are added correctly', async () => {
      const notes = await helper.notesInDB()
      const note = notes[1]
      expect(note.noteItems).toEqual(helper.initialNotes[1].noteItems)
    })
    test('Partially defined note to have default values', async () => {
      const deltaTime = 2*1000 // Jitter in time allowed
      const notes = await helper.notesInDB()
      const savedDefaultNote = notes[2]
      const partialNote = Object.assign({}, savedDefaultNote)

      partialNote.name = ''
      partialNote.repeatability = repeatability.NEVER
      partialNote.user = 'Test User'
      partialNote.noteCategory = 'Misc'

      const timeElapsed = Date.now()
      expect(savedDefaultNote).toBeDefined()
      expect(savedDefaultNote.dateCreated - testTime).toBeLessThanOrEqual(timeElapsed + deltaTime)

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

// --- User ---
describe('when adding users to the database', () => {
  // alustetaan testitietokanta ennen jokaista testiä
  beforeEach(async () => {
    await User.deleteMany({})
  })
  describe('users are added correctly', async () => {
    for (let user of helper.initialUsers) {
      let userObject = new User(user)
      await userObject.save()
    }
    test('correct number of users are present', async () => {
      const users = await helper.usersInDB()
      expect(users.length).toBe(3)
    })
    test('fully defined user is added correctly', async () => {
      const users = await helper.usersInDB()
      expect(users[0]).toBeDefined()
      expect(users[0]).toEqual(helper.initialUsers[0])
    })
    test('user\'s notes are added correctly', async () => {
      const users = await helper.usersInDB()
      const user = users[1]
      expect(user.notes).toEqual(helper.initialUsers[1].notes)
    })
    test('partially defined user to have default values', async () => {
      const users = await helper.usersInDB()
      const savedDefaultUser = users[2]
      const partialUser = Object.assign({}, savedDefaultUser)
      expect(savedDefaultUser).toBeDefined()
      expect(savedDefaultUser).toEqual(partialUser)
    })
    test('Adding malformed user fails validation', async () => {
      const malformUser = {
        username: null,
        email: null,
        name: null,
        notes: [null],
      }
      expect(new User(malformUser)).toThrow() // TODO: add all validation errors so each one is tested
    })
  })
})

// --- Category ---
describe('when adding categories to the database', () => {
  // alustetaan testitietokanta  ennen jokaista testiä
  beforeEach(async () => {
    await Category.deleteMany({})
  })
  describe('categories are added correctly', async () => {
    for (let category of helper.initialCategories) {
      let categoryObject = new Category(category)
      await categoryObject.save()
    }
    test('correct number of categories are present', async () => {
      const categories = await helper.categoriesInDB()
      expect(categories.length).toBe(2)
    })
    test('fully defined category is added correctly', async () => {
      const categories = await helper.categoriesInDB()
      expect(categories[0]).toBeDefined()
      expect(categories[0]).toEqual(helper.initialCategories[0])
    })

    test('Adding malformed category fails validation', async () => {
      const malformCat = {
        name: null
      }
      expect(new Category(malformCat)).toThrow() // TODO: add all validation errors so each one is tested
    })
  })
})

// --- Tag ---
describe('when adding tags to the database', () => {
  // alustetaan testitietokanta ennen jokaista testiä
  beforeEach(async () => {
    await Tag.deleteMany({})
  })
  describe('users are added correctly', async () => {
    for (let tag of helper.initialTags) {
      let tagObject = new Tag(tag)
      await tagObject.save()
    }
    test('correct number of tags are present', async () => {
      const tags = await helper.tagsInDB()
      expect(tags.length).toBe(2)
    })
    test('fully defined user is added correctly', async () => {
      const tags = await helper.tagsInDB()
      expect(tags[0]).toBeDefined()
      expect(tags[0]).toEqual(helper.initialTags[0])
    })
    test('Adding malformed note fails validation', async () => {
      const malformTag = {
        tag: null,
      }
      expect(new Tag(malformTag)).toThrow() // TODO: add all validation errors so each one is tested
    })
  })
})
afterAll(() => {
  mongoose.connection.close()
})
