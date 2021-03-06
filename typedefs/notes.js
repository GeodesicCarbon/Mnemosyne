const { gql } = require('apollo-server-express')

const notesTypedef = gql`
  scalar Date

  type Note {
    id: ID!
    name: String
    dateCreated: Date!
    dateDue: Date
    noteItems: [NoteItems!]
    noteCategory: String!
    noteTags: [String!]
    repeatability: String
    user: String
  }

  type NoteItems {
    id: ID!
    itemName: String!
    isDone: Boolean!
  }

  extend type Query {
    allNotes: [Note!]!
  }

  extend type Mutation {
    addNote(
      name: String
      dateDue: Date
      noteItems: [String!]
      noteCategory: String
      noteTags: [String!]
      user: String,
      repeatability: String
    ): Note

    addItemToNote(
      id: String!
      newItem: String!
    ): Note

    removeItemFromNote(
      id: String!
      itemId: String!
    ): Note

    completeItem(
      id: String!
      itemId: String!
    ): Note

    uncompleteItem(
      id: String!
      itemId: String!
    ): Note

    updateNote(
      id: String!
      name: String
      dateDue: Date
      noteCategory: String
      noteTags: [String!]
      user: String,
      repeatability: String
    ): Note

    deleteNote(
      id: String!
    ): Boolean
  }
`
module.exports = notesTypedef
