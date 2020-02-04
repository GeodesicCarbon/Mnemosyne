const { gql } = require('apollo-server-express')

const categoriesTypedef = gql`
  type Category {
    name: String!
    notes: [Note!]
  }

  extend type Query {
    allCategories: [Category!]!
  }
`
module.exports = categoriesTypedef
