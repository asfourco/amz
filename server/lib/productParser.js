import cheerio from 'cheerio'

// selectors
const PRODUCT_TITLE = '.productTitle'
const RANK = '.'
// testing
export default function test () {
  const html = `
  <ul id="fruits">
  <li class="apple">Apple</li>
  <li class="orange">Orange</li>
  <li class="pear">Pear</li>
</ul>
`
  const $ = cheerio.load(html)

  console.log(`apple li => ${$('.apple', '#fruits').text()}`)
}

test()