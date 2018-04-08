import { Products } from './dbConnector'
import amazonReviewCrawler from 'amazon-reviews-crawler'
import extractProductInfo from '../lib/productParser'

const addProductReview = async (productId, review) => {

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
    } catch (e) {
      console.error(`Error saving product review: ${e}`)
    }
}

const extractReviews = async (ASIN, productId) => {
  console.log(`extractReviews called with ASIN:${ASIN} and db product ID: ${productId}`)
  try {
    const result = await amazonReviewCrawler(ASIN)
    await result.reviews.map(review => addProductReview(productId, review))
    console.log(`reviews extracted ...`)
    return
  } catch (e) {
    console.error(`Error fetching reviews for product ${ASIN}, ${e}`)
  }
}

const getProductInfo = async (ASIN) => {
  console.log(`getProductInfo called with ASIN: ${ASIN}`)
  try {
    const info = await extractProductInfo(ASIN)
    return info
  } catch (e) {
    console.error(`Error fetching info for product ${ASIN}, ${e}`)
  }
}
/*
const awsClient = new OperationHelper({
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  assocId: process.env.ASSOC_ID
})
*/


export {
  // awsClient,
  getProductInfo,
  extractReviews
}
