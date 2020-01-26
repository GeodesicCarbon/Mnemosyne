// ladataan tarvittavat moduulit
const mongoose = require('mongoose')
const config = require('../utils/config')
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true ,
  useFindAndModify: false,
  useCreateIndex: true
})

// ladataan apumoduuli testejä varten
const helper = require('./test_helper')

// Ladataan tarvittavat MongoDB -skeemat
const Note = require('../models/note').default
const User = require('../models/user')
const Category = require('../models/category')
const Tag = require('../models/tag')

// Ladataan tarvittava enum
const repeatability = require('../models/note').repeatability

// --- Note ---
describe('when adding notes to the database', () => {
  // alustetaan testitietokanta ennen jokaista testiä
  const testTime = Date.now()
  beforeEach(async () => {
    await Note.deleteMany({})
    for (let note of helper.initialNotes) {
      let noteObject = new Note(note)
      await noteObject.save()
    }
  })
  describe('notes are added correctly', () => {
    test('correct number of notes are present', async () => {
      const notes = await helper.notesInDB()
      expect(notes.length).toBe(helper.initialNotes.length)
    })
    test('fully defined note is added correctly', async () => {
      const notes = await helper.notesInDB()
      notes[0].dateCreated = Date.parse(notes[0].dateCreated)
      notes[0].dateDue = Date.parse(notes[0].dateDue)
      expect(typeof notes[0].id).toBe('string')
      delete notes[0].id
      delete notes[0].noteItems[0]._id
      delete notes[0].noteItems[1]._id
      expect(notes[0]).toBeDefined()
      expect(notes[0]).toEqual(helper.initialNotes[0])
    })
    test('noteItems are added correctly', async () => {
      const notes = await helper.notesInDB()
      const note = notes[1]
      delete notes[1].noteItems[0]._id
      delete notes[1].noteItems[1]._id
      expect(note.noteItems).toEqual(helper.initialNotes[1].noteItems)
    })
    test('Partially defined note to have default values', async () => {
      const deltaTime = 2*1000 // Jitter in time allowed
      const notes = await helper.notesInDB()
      const savedDefaultNote = notes[2]
      const partialNote = Object.assign({}, helper.initialNotes[2])

      partialNote.name = ''
      partialNote.repeatability = repeatability.NEVER
      partialNote.user = 'Test User'
      partialNote.noteCategory = 'Misc'
      partialNote.noteItems = []
      partialNote.noteTags = []

      const timeElapsed = Date.now()
      expect(savedDefaultNote).toBeDefined()
      expect(savedDefaultNote.dateCreated - testTime).toBeLessThanOrEqual(timeElapsed + deltaTime)

      delete savedDefaultNote.dateCreated
      delete savedDefaultNote.id
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
      const malformNoteObject = new Note(malformNote)
      expect(malformNoteObject.save()).rejects.toThrow() // TODO: add all validation errors so each one is tested
    })
  })
})

// --- User ---
describe('when adding users to the database', () => {
  // alustetaan testitietokanta ennen jokaista testiä
  beforeEach(async () => {
    await User.deleteMany({})
    for (let user of helper.initialUsers) {
      let userObject = new User(user)
      await userObject.save()
    }
  })
  describe('users are added correctly', () => {
    test('correct number of users are present', async () => {
      const users = await helper.usersInDB()
      expect(users.length).toBe(helper.initialUsers.length)
    })
    test('fully defined user is added correctly', async () => {
      const users = await helper.usersInDB()
      expect(users[0]).toBeDefined()
      users[0].passwordHash = helper.initialUsers[0].passwordHash
      delete users[0].id
      delete users[0].notes[0]._id
      expect(users[0]).toEqual(helper.initialUsers[0])
    })
    test('user\'s notes are added correctly', async () => {
      const users = await helper.usersInDB()
      const user = users[1]
      delete user.notes[0]._id
      delete user.notes[1]._id
      delete user.notes[2]._id
      expect(user.notes).toEqual(helper.initialUsers[1].notes)
    })
    test('partially defined user to have default values', async () => {
      const users = await helper.usersInDB()
      const savedDefaultUser = users[2]
      const partialUser = Object.assign({}, helper.initialUsers[2])
      partialUser.notes = []
      expect(savedDefaultUser).toBeDefined()
      delete savedDefaultUser.id
      expect(savedDefaultUser).toEqual(partialUser)
    })
    test('Adding malformed user fails validation', async () => {
      const malformUser = {
        username: null,
        email: null,
        name: null,
        notes: [null],
      }
      const malformUserObject = new User(malformUser)
      expect(malformUserObject.save()).rejects.toThrow() // TODO: add all validation errors so each one is tested
    })
  })
})

// --- Category ---
describe('when adding categories to the database', () => {
  // alustetaan testitietokanta  ennen jokaista testiä
  beforeEach(async () => {
    await Category.deleteMany({})
    for (let category of helper.initialCategories) {
      let categoryObject = new Category(category)
      await categoryObject.save()
    }
  })
  describe('categories are added correctly', () => {
    test('correct number of categories are present', async () => {
      const categories = await helper.categoriesInDB()
      expect(categories.length).toBe(helper.initialCategories.length)
    })
    test('fully defined category is added correctly', async () => {
      const categories = await helper.categoriesInDB()
      expect(categories[0]).toBeDefined()
      expect(categories[0].id).toBeDefined()
      delete categories[0].id
      expect(categories[0]).toEqual(helper.initialCategories[0])
    })

    test('Adding malformed category fails validation', async () => {
      const malformCat = {
        name: null
      }
      const malformCatObject = new Category(malformCat)
      expect(malformCatObject.save()).rejects.toThrow() // TODO: add all validation errors so each one is tested
    })
  })
})

// --- Tag ---
describe('when adding tags to the database', () => {
  // alustetaan testitietokanta ennen jokaista testiä
  beforeEach(async () => {
    await Tag.deleteMany({})
    for (let tag of helper.initialTags) {
      let tagObject = new Tag(tag)
      await tagObject.save()
    }
  })
  describe('users are added correctly', () => {
    test('correct number of tags are present', async () => {
      const tags = await helper.tagsInDB()
      expect(tags.length).toBe(helper.initialTags.length)
    })
    test('fully defined user is added correctly', async () => {
      const tags = await helper.tagsInDB()
      expect(tags[0]).toBeDefined()
      expect(tags[0].id).toBeDefined()
      delete tags[0].id
      expect(tags[0]).toEqual(helper.initialTags[0])
    })
    test('Adding malformed note fails validation', async () => {
      const malformTag = {
        tag: null,
      }
      const malformTagObject = new Tag(malformTag)
      expect(malformTagObject.save()).rejects.toThrow() // TODO: add all validation errors so each one is tested
    })
  })
})
afterAll(() => {
  mongoose.connection.close()
})
