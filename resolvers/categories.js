// ladataan tarvittavat moduulit
const { UserInputError } = require('apollo-server')

// Ladataan tarvittavat MongoDB -skeemat
const Category = require('../models/note').default

const categoriesResolver = {
  Query: {
    allCategories: async () => {
      return await Category.find({})
    }
  }
}

module.exports = categoriesResolver
