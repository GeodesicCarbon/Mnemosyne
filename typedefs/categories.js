const { gql } = require('apollo-server-express')

const categoriesTypedef = gql`
  type Category {
    id: ID!
    name: String!
    notes: [Note!]
  }

  extend type Query {
    allCategories: [Category!]!
  }

  extend type Mutation {
    addCategory(
      name: String!
      notes: [ID!]
    ): Category
  }
`
module.exports = categoriesTypedef
