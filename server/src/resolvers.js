import { PubSub, withFilter } from 'graphql-subscriptions'
import { getProductInfo, extractReviews } from './amzConnector'
import { generateNewId } from '../lib/helpers'
import { Products } from './dbConnector'

const pubsub = new PubSub()

export const resolvers = {
  Query: {
    products: async () => {
      try {
        const products = await Products.find({})
        return products
      } catch (e) {
        console.error(`Error fetching products from db: ${e}`)
      }
    },
    getProductById: async (root, { id }) => {
      try {
        const product = await Products.findById(id)
        return product
      } catch (e) {
        console.error(`Error fetching product with id: ${id}, Error:${e}`)
      }
    },
    getProductByAsin: async (root, { asin }) => {
      try {
        const product = await Products.findOne({ 'ASIN': asin })
        return product
      } catch (e) {
        console.error(`Error fetching product with asin: ${asin}, Error:${e}`)
      }
    },
    reviews: async (root, { productId }) => {
      try {
        const product = await Products.findById(productId)
        return product.reviews
      } catch (e) {
        console.error(`Error fetching reviews for product ${productId}, Error: ${e}`)
      }
    }
  },
  Mutation: {
    fetchProductFromAWS: async (root, { ASIN }) => {
      console.log(`fetchProductFromAWS called for ASIN: ${ASIN}`)
      // call amz product api
      // parse the returned xml to js
      // create new record in Products
      // parse reviews from iFrame and for each add to product reviews
      try {

        const productInfo = await getProductInfo(ASIN)
        const fetchedProduct = await Products.create({
          ASIN: ASIN,
          title: productInfo.title,
          rank: productInfo.rank
        })

        extractReviews(ASIN, fetchedProduct.id)
        pubsub.publish('productAdded', {productAdded: fetchedProduct})


        return fetchedProduct
      } catch (e) {
        console.error(`Error fetching product with ASIN: ${ASIN}, Error: ${e}`)
      }
    },
    addProduct: async (root, { input }) => {
      try {
        const newProduct = await Products.create({ ...input })
        pubsub.publish('productAdded', {productAdded: newProduct})
        return newProduct
      } catch (e) {
        console.error(`Error adding product: ${e}`)
      }
    },
    addProductReview: async (root, { productId, review }) => {
      const newProductReview = {
        id: String(generateNewId(10)),
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
    productAdded: {
      subscribe: () => pubsub.asyncIterator('productAdded')
    },
    productReviewAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('productReviewAdded'), (payload, variables) => payload.productId === variables.productId)
    }
  }
}
