import Nightmare from 'nightmare'
import randomUA from 'random-ua'
import { generateNewId } from './helpers'
import { Products } from '../src/dbConnector'

export const addProductReview = async (productId, review, pubsub) => {
  const newId = generateNewId(10)
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
  } catch (e) {
    console.error(`Error saving product review: ${e}`)
  }
}

const scrape = async (ASIN) => {
  const nm = new Nightmare()

  try {
    const pages = await nm.useragent(randomUA.generate())
      .goto(`https://www.amazon.com/product-review/${ASIN}/ref=cm_cr_arp_d_viewopt_srt?reviewerType=all_reviews&pageNumber=1&sortBy=recent`)
      .wait('#a-page')
      .evaluate(() => {
        return document.querySelector('#cm_cr-pagination_bar').querySelectorAll('li.page-button').length
      })
      .end()

    console.log(`we have ${pages} pages to scrape`)

    return pages
  } catch (e) {
    console.error(`Error scraping review pages => ${e}`)
    return undefined
  }
}

export default scrape
