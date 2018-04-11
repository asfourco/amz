import { schema } from '../src/schema'
import {graphql} from 'graphql'
import { setupTest } from './testing_helper'


describe('GraphQL services', () => {
  beforeEach(() => setupTest())

  it('Returns with data', async () => {
    const query = `{products { id, title, ASIN }}`
    const result = await graphql(schema, query)
    const { data } = result
    expect(data.products).not.toBe(null)
  })

  it ('Can add a product', async () => {
    const mutation = `
      mutation {
        addProduct(
          input: {
            ASIN: "AB12345CD",
            title: "Lorem ipsum title",
            rank:[
              {
                id: "A123BD"
                text: "#123 in some product"
              }
            ]
          }
        ) { id, title, ASIN }
        }`

    const result = await graphql(schema, mutation)
    const { data } = result
    expect(data.addProduct).not.toBe(null)
    expect(data.addProduct).toHaveProperty('id')
    expect(data.addProduct).toHaveProperty('title')
    expect(data.addProduct).toHaveProperty('ASIN')
  })
})


describe('Retreive data', () => {
  let product = {}

  it ('can get all products', async () => {
    const query = `{ products { id, title, ASIN } }`
    const result = await graphql(schema, query)
    const { data: { products} } = result
    expect(products).not.toBe(null)
    expect(products).toHaveLength(1)
    product = products[0]
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('title')
    expect(product).toHaveProperty('ASIN')
  })

  it ('Can retreive the product by _id', async () => {
    const query = `{ getProductById(id:"${product.id}"){title, ASIN}}`
    const result = await graphql(schema, query)
    const { data: { getProductById} } = result
    expect(getProductById).not.toBe(null)
    expect(getProductById.title).toContain('ipsum')
    expect(getProductById.ASIN).toMatch(/AB12345CD/)
  })

  it ('Can retreive the product by ASIN', async () => {
    const query = `{ getProductByAsin(ASIN:"${product.ASIN}"){title, ASIN}}`
    const result = await graphql(schema, query)
    const { data: { getProductByAsin} } = result
    
    expect(getProductByAsin).not.toBe(null)
    expect(getProductByAsin.title).toContain('ipsum')
    expect(getProductByAsin.ASIN).toMatch(/AB12345CD/)
  })
})

describe('Reviews', async () => {

  it ('Can add a review to a product', async () => {
    const query = `{ products { id, title, ASIN } }`
    const resultQ = await graphql(schema, query)
    const { data: { products }} = resultQ
    let product = products[0]

    const mutation = `
      mutation {
        addProductReview(
          productId: "${product.id}"
          review: {
            id: "a12312444"
            title: "some product"
            author: "john doe"
            rating: 3
            date: "1988-08-08"
            text: "I bought this product, I use product, I comment on product"
          }
        ){
          id
          title
          rating
          author
        }
      }
    `
    const result = await graphql(schema, mutation)
    const { data : {addProductReview} } = result
    expect(addProductReview).not.toBe(null)
    expect(addProductReview.id).toMatch(/a12312444/)
    expect(addProductReview.rating).toBe(3)
  })

  it ('can retreive the reviews of a product', async () => {
    const query = `{ products { id, title, ASIN } }`
    const resultQuery = await graphql(schema, query)
    const { data: { products }} = resultQuery
    let product = products[0]

    const reviewQuery = `{ getProductById(id:"${product.id}") { ASIN, reviews {id text } }}`
    const resultReviewQuery = await graphql(schema, reviewQuery)
    const { data: { getProductById }} = resultReviewQuery
    expect(getProductById.reviews).toHaveLength(1)
    expect(getProductById.reviews[0].text).toContain('I use product')
  })
})

describe('Fetch and store', () => {
  // actual data:
  // https://www.amazon.com/dp/B01787OLQG/
  const ASIN = "B01787OLQG"

  it ('can fetch data from amazon', async () => {

    const mutation = `
      mutation {
        fetchProductFromAWS(
          ASIN: "${ASIN}"
        ) { id, title, ASIN, rank { id } }
      }
    `
    const mutationResult = await graphql(schema, mutation)
    
    const { data: { fetchProductFromAWS: product }} = mutationResult
    expect(product).not.toBe(null)
    expect(product.title).toContain('Cashmere')
    expect(product.rank).toHaveLength(3)
  }, 40000)
})