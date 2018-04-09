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
        const title = ( document.getElementsByTagName('title') ) ?
           document.getElementsByTagName('title')[0].innerText : ''

        // there are at least two selectors for where the sales rank can reside
        const rank = (document.querySelector('#SalesRank') ) ?
          document.querySelector('#SalesRank').innerText :
          (document.querySelector('#prodDetails')) ?
            document.querySelector('#prodDetails').innerText : ''

        return {title, rank}
      })
      .end()

    // remove 'Amazon Best Sellers Rank' text
    let rankArray = result.rank.split('#').slice(1)
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
