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
    noteTags: String!
    repeatability: String
    user: String
  }

  type NoteItems {
    itemName: String!
    isDone: Boolean!
  }

  extend type Query {
    allNotes: [Note!]!
  }
`
module.exports = notesTypedef
