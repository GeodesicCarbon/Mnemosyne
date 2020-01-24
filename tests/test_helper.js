// tuodaan tarvittavat skeemat
const { Note, repeatability } = require('../models/note')
const User = require('../models/user')
const Category = require('../models/category')
const Tag = require('../models/tag')

// luodaan esimerkkiobjektit, joilla populoidaan skeema
const initialNotes = [
  {
    name: 'Y2k',
    dateCreated: Date.parse('1999-01-01'),
    dateDue: Date.parse('2000-01-01'),
    noteItem: [{ itemName: 'Fix Y2K', isDone: false }, { itemName: 'party', isDone: false }],
    noteCategory: 'Low-priority',
    noteTags: ['Blue', 'Epoch'],
    repeatability: repeatability.ONCE,
    user: 'IBM'
  }
]

const initialUsers = [
  {
    username: 'testuser',
    email: 'test.user@altavista.com',
    name: 'Foo Bar',
    passwordHash: 'qwertyuiop',
    notes : {
      note: 'Y2k'
    }
  }
]

const initialCategories = [
  {
    name: 'Test Category'
  }
]

const initialTags = [
  {
    tag: 'FooTag'
  }
]

// Palautetaan kaikki skeeman objektit
const notesInDB = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const categoriesInDB = async () => {
  const categories = await Category.find({})
  return categories.map(category => category.toJSON())
}

const tagsInDB = async () => {
  const tags = await Tag.find({})
  return tags.map(tag => tag.toJSON())
}

module.exports = {
  initialNotes,
  initialUsers,
  initialCategories,
  initialTags,
  notesInDB,
  usersInDB,
  categoriesInDB,
  tagsInDB
}
