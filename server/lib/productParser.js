import Nightmare from 'nightmare'
import randomUA from 'random-ua'
import { generateNewId } from './helpers'

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

    const rankData = result.rank
    let rankArray = rankData.split('#').slice(1) // remove 'Amazon Best Sellers Rank' text
    // assemble into data set of rankings
    const newRankData = Object.keys(rankArray).map(i =>
      ({
        id: generateNewId(4),
        text:`#${rankArray[i]}`
      })
    )

    return {title: result.title, rank: newRankData}
  } catch (e) {
    console.error(`Error scraping product info => ${e}`)
    return undefined
  }
}

export default scrape
