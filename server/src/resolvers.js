import { PubSub, withFilter } from 'graphql-subscriptions'
import { awsClient, extractReviews } from './amzConnector'
import { Products } from './dbConnector'
import casual from 'casual' //fake data generator

const pubsub = new PubSub()

const insertProduct = async ({ ASIN, title, rank }) => {
  try {
    const newProduct = await Products.create({ ASIN, title, rank })
    // newProduct.reviews = await extractReviews(ASIN)
    // return await newProduct.save()
    return newProduct
  } catch (e) {
    console.error(`Error processing fetched product ${ASIN}, ${e}`)
  }
}

export const resolvers = {
  Query: {
    getAllProducts: async () => {
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
    fetchProductFromAWS: async (root, { ASIN }) => {
      // call amz product api
      // parse the returned xml to js
      // create new record in Products
      // parse reviews from iFrame and for each add to product reviews
      try {
      /*
        const response = await awsClient.execute('ItemLookup', {
          'ItemId': ASIN,
          'ResponseGroup': 'ItemAttributes, Reviews, SalesRank'
        })
      */
        const fetchedProduct = await Products.create({
          ASIN: ASIN,
          title: casual.title,
          rank: casual.integer(0, 999999)
        })

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
    productAdded: {
      subscribe: () => pubsub.asyncIterator('productAdded')
    },
    productReviewAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('productReviewAdded'), (payload, variables) => payload.productId === variables.productId)
    }
  }
}
