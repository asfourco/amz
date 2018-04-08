import { getReviewsForProductId } from '../lib/reviewParser'
import amazonReviewCrawler from 'amazon-reviews-crawler'
import extractProductInfo from '../lib/productParser'
// import { OperationHelper } from 'apac'

const extractReviews = async (ASIN) => {
  console.log(`extractReviews called with ASIN:${ASIN}`)
  try {
    const reviews = await amazonReviewCrawler(ASIN)
    return reviews
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
