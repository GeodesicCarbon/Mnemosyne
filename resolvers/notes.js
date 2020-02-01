// ladataan tarvittavat moduulit
const { GraphQLScalarType } =  require('graphql')
const { UserInputError } = require('apollo-server')
const { Kind } = require('graphql/language')

// Ladataan tarvittavat MongoDB -skeemat
const Note = require('../models/note').default

// Ladataan tarvittava enum
const repeatability = require('../models/note').repeatability

const notesResolver = {
  Query: {
    allNotes: async () => {
      return await Note.find({})
    }
  },
  Mutation: {
    addNote: async (root, args) => {
      const data = { ...args }
      if (data.noteItems)
        data.noteItems = data.noteItems.map((item) => ({ itemName: item, isDone: false }))
      const note = new Note({ ...data })
      try {
        await note.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return note
    },
    addItemToNote: async (root, args) => {
      let note
      try {
        note = await Note.findById(args.id)
        if (!note) {
          throw new UserInputError('Invalid note id.',{
            invalidArgs: args
          })
        }
        note.noteItems = note.noteItems.concat({ itemName: args.newItem, isDone: false })
        await note.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return note
    }
  },
  // Tehdään Date-skalaarin toteutus
  // Käytetty esimerkkikoodia: https://www.apollographql.com/docs/graphql-tools/scalars/#custom-scalar-examples
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10) // ast value is always in string format
      }
      return null
    },
  }),
}
module.exports = notesResolver
