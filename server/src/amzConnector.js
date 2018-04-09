import amazonReviewCrawler from 'amazon-reviews-crawler'
import extractProductInfo from '../lib/productParser'
import extractNumReviewPages, { addProductReview } from '../lib/reviewParser'

const extractReviews = async (ASIN, productId, pubsub) => {
  console.log(`extractReviews called with ASIN:${ASIN} and db product ID: ${productId}`)
  try {
    // get the number of pages for all reviews
    const pages = await extractNumReviewPages(ASIN)

    // loop through every page and scrape
    for (let page = 1; page < pages + 1; page++) {
      const result = await amazonReviewCrawler(ASIN, {
        page: `https://www.amazon.com/product-reviews/{{asin}}/ref=cm_cr_arp_d_viewopt_srt?reviewerType=all_reviews&pageNumber=${page}&sortBy=recent`
      })
      await result.reviews.map(review => addProductReview(productId, review, pubsub))
      console.log(`reviews extracted from page ${page} ...`)
    }
    console.log(`review extraction complete`)
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

export {
  getProductInfo,
  extractReviews
}
