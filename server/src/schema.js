import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

const TYPE_DEFINITIONS = `
  type Product {
    id: ID
    ASIN: String!
    title: String!
    rank: Int!
    reviews: [Review]
  }
  
  type Review {
    id: ID
    rating: Int
    title: String
    text: String
    author: String
    date: String
    link: String
  }
  
  input ProductInput {
    ASIN: String!
    title: String!
    rank: Int!
    reviews: [ReviewInput]
  }
  
  input ReviewInput {
    rating: Int
    title: String
    text: String
    author: String
    date: String
    link: String  
  }
  
  type Query {
    fetchProductFromAWS(ASIN: String!): Product
    getAllProducts: [Product]
    getProduct(id: ID!): Product
    getProductReviews(id: ID!): [Review]
  }
  
  type Mutation {
    addProduct(input: ProductInput): Product
    addProductReview(productId: ID!, review: ReviewInput): Review
  }
  
  type Subscription {
    productReviewAdded(productId: ID!): Review
  }
`

const schema = makeExecutableSchema({ typeDefs: TYPE_DEFINITIONS, resolvers })

export { schema }
