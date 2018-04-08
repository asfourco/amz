import { getReviewsForProductId } from '../lib/reviewParser'
// import { OperationHelper } from 'apac'

const extractReviews = async (ASIN) => {
  try {
    const reviews = await getReviewsForProductId(ASIN)
    return reviews
  } catch (e) {
    console.error(`Error fetching reviews for product ${ASIN}, ${e}`)
  }
}

/*
const awsClient = new OperationHelper({
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  assocId: process.env.ASSOC_ID
})
*/

const awsScrub = async (ASIN) => {
  console.log(`awsScrub called`)
}

export {
  // awsClient,
  awsScrub,
  extractReviews
}
