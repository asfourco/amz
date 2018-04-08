import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

const TYPE_DEFINITIONS = `
  """
  Product model that hold an Amazon Product by it's ASIN
  """
  type Product {
    id: ID
    ASIN: String!
    title: String!
    rank: [Rank]!
    """
    Reviews of this product
    """
    reviews: [Review]
  }
  
  """
  Rank model
  """
  type Rank {
    id: String
    text: String
  }
  
  """
  Review model
  """
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
    rank: [RankInput]
    reviews: [ReviewInput]
  }
  
  input RankInput {
    id: String
    text: String
  }
 
  input ReviewInput {
    id: ID
    rating: Int
    title: String
    text: String
    author: String
    date: String
    link: String  
  }
  
  type Query {
    """
    Get all products stored in our database
    """
    products: [Product]
    
    """
    Get a specific product by it's database ID from our database
    """
    getProductById(id: ID!): Product
    
    """
    Get a specific product by it's ASIN from our database
    """
    getProductByAsin(asin: String!): Product
    
    """
    Get the reviews associated with a product stored in our database
    """
    reviews(productId: ID!): [Review]
  }
  
  type Mutation {
    """
    Call Amazon and request the product info. It will then store the
    data in our database for future use
    """
    fetchProductFromAWS(ASIN: String!): Product

    """
    Add a product to our database
    """
    addProduct(input: ProductInput): Product
    
    """
    Add a review of a specific product to our database
    """
    addProductReview(productId: ID!, review: ReviewInput): Review
  }
  
  type Subscription {
    """
    Subscription of products. New data will be pushed to clients 
    """
    productAdded: Product
  
    """
    Subscription of product reviews. New data will be pushed to clients 
    """
    productReviewAdded(productId: ID!): Review
  }
`

const schema = makeExecutableSchema({ typeDefs: TYPE_DEFINITIONS, resolvers })

export { schema }
