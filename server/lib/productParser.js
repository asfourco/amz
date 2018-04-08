import cheerio from 'cheerio'
import Nightmare from 'nightmare'
import randomUA from 'random-ua'

const util = require('util')
// selectors
const PRODUCT_TITLE = '#productTitle'
const RANK = '#SalesRank'

const scrape = async (ASIN) => {
  const nm = new Nightmare()

  try {
    const result = await nm.useragent(randomUA.generate())
      .goto(`https://www.amazon.com/dp/${ASIN}`)
      .wait('#a-page')
      .evaluate(() => {
        const title = document.querySelector('#productTitle').innerText
        const rank = document.querySelector('#SalesRank').innerText
        return {title, rank}
      })
      .end()
    return result
  } catch (e) {
    console.error(`error fetching => ${e}`)
    return undefined
  }
}

const extractProductInfo = async (ASIN) => {

  let data = {}

  return nightmare
    .useragent(randomUA.generate())
    .goto(`https://www.amazon.com/dp/${ASIN}`)
    .evaluate((PRODUCT_TITLE) => {
      console.log('product title =>', document.querySelector(PRODUCT_TITLE).innerText)
      document.querySelector(PRODUCT_TITLE).innerText
    }, PRODUCT_TITLE)
    .then((text) => data['productTitle'] = text )
    // .evaluate((RANK) => {
    //   console.log('rank =>', document.querySelector(RANK).innerText)
    //   document.querySelector(RANK).innerText
    // }, RANK)
    // .then((text) => data['rank'] = text )
    // .evaluate(() => {
    //     const html = document.querySelector('body').innerHTML
    //     const $ = cheerio.load(html)
    //     data['productTitle'] = $(PRODUCT_TITLE).text()
    //     data['rank'] = $(RANK).text()
    // })
    // .end()
    .then((result) => console.log('nightmare result => ', result))
    .then(() => { return data})
  // return data
}

export default scrape
