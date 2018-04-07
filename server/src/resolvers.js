import { PubSub, withFilter } from 'graphql-subscriptions'
import { Products } from './dbConnector'

const pubsub = new PubSub()

export const resolvers = {
  Query: {
    fetchProductFromAWS: async (root, { ASIN }) => {
      // call aws product api
      // parse the returned xml to js
      // create new record in Products
      // parse reviews from iFrame and for each add to product reviews
      console.log('fetching AWS product info for: ', ASIN)
      const fakeProduct = {
        id: require('crypto').randomBytes(10).toString('hex'),
        ASIN: ASIN,
        title: "Product title",
        rank: 1000,
        reviews: []
      }

      return fakeProduct
    },
    getAllProducts: async () => {
      try {
        const products = await Products.find({})
        return products
      } catch (e) {
        console.error(`Error fetching products from db: ${e}`)
      }
    },
    getProduct: async (root, { id }) => {
      try {
        const product = await Products.findById(id)
        return product
      } catch (e) {
        console.error(`Error fetching product with id: ${id}, Error:${e}`)
      }
    },
    getProductReviews: async (root, { id }) => {
      try {
        const product = await Products.findById(id)
        return product.reviews
      } catch (e) {
        console.error(`Error fetching reviews for product ${id}, Error: ${e}`)
      }
    }
  },
  Mutation: {
    addProduct: async (root, { input }) => {
      console.log({ ...input })
      const newProduct = await Products.create({ ...input })
      return newProduct
    },
    addProductReview: async (root, { productId, review }) => {
      const newId = require('crypto').randomBytes(10).toString('hex')
      const newProductReview = {
        id: String(newId),
        ...review
      }
      try {
        await Products.findOneAndUpdate(
          { _id: productId },
          { $push: { 'reviews': newProductReview } },
          { new: true, upsert: true }
        )
        pubsub.publish('productReviewAdded', { productReviewAdded: newProductReview, productId: productId })
        return newProductReview
      } catch (e) {
        console.error(`Error saving product review: ${e}`)
      }
    }
  },
  Subscription: {
    productReviewAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('productReviewAdded'), (payload, variables) => payload.productId === variables.productId)
    }
  }
}
