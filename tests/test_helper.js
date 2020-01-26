// tuodaan tarvittavat skeemat
const Note = require('../models/note').default
const repeatability = require('../models/note').repeatability
const User = require('../models/user')
const Category = require('../models/category')
const Tag = require('../models/tag')

// luodaan esimerkkiobjektit, joilla populoidaan skeema
const initialNotes = [
  {
    name: 'Y2k',
    dateCreated: Date.parse('1999-01-01'),
    dateDue: Date.parse('2000-01-01'),
    noteItems: [{ itemName: 'Fix Y2K', isDone: false }, { itemName: 'party', isDone: false }],
    noteCategory: 'Low-priority',
    noteTags: ['Blue', 'Epoch'],
    repeatability: repeatability.ONCE,
    user: 'IBM'
  },
  {
    name: 'oneDone',
    noteItems: [{ itemName: 'Not done', isDone: false }, { itemName: 'Done', isDone: true }]
  },
  {

  }
]

const initialUsers = [
  {
    username: 'testuser',
    email: 'test.user@altavista.com',
    name: 'Foo Bar',
    passwordHash: 'qwertyuiop',
    notes : [{
      note: 'Y2k'
    }]
  },
  {
    username: 'moreNotes',
    email: 'foobar',
    notes : [{
      note: 'note1'
    },{
      note: 'note2'
    },{
      note: 'note12345'
    }]
  },
  {
    username: 'default',
    email: 'default',
  }
]

const initialCategories = [
  {
    name: 'Test Category'
  },
  {
    name: 'Test Category 2'
  }
]

const initialTags = [
  {
    tag: 'FooTag'
  },
  {
    tag: 'BarTag'
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
