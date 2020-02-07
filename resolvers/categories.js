// ladataan tarvittavat moduulit
const { UserInputError } = require('apollo-server')
const mongoose = require('mongoose')

// Ladataan tarvittavat MongoDB -skeemat
const Category = require('../models/category')
const Note = require('../models/note').default

const categoriesResolver = {
  Query: {
    allCategories: async () => {
      try {
        const cats = await Category.find({}).populate('notes')
        return cats
      } catch (e) {
        throw new UserInputError(e.message)
      }
      // return await Category.find({}).populate('notes')
    }
  },
  Mutation: {
    addCategory: async (root, args) => {
      const data = { ...args }
      const notes = []
      const category = new Category({ name: data.name })

      if (data.notes){
        for (const note of data.notes) {
          try {
            const noteObj = await Note.findById(note.toString())
            if (noteObj) {
              noteObj.category = category._id
              notes.push(noteObj._id)
            }
          } catch (error) {
            throw new UserInputError('Invalid Note ID', {
              invalidArgs: args
            })
          }
        }
      }
      category.notes = notes
      try {
        await category.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return await category.populate('notes').execPopulate()
    },
  }
}

module.exports = categoriesResolver
