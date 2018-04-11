// mock out subscription functionality of graphql
jest.mock('../components/FetchProduct')
jest.mock('../components/Products')
jest.mock('../components/Product')
jest.mock('../components/ReviewList')

import React from 'react'
import ReactDOM from 'react-dom'
import App from '../pages/App'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import casual from 'casual'

import FetchProduct from '../components/FetchProduct';
import Products from '../components/Products'
import Product from '../components/Product'



// test setup
configure({ adapter: new Adapter() })
casual.define('asin', () => {
  const string = `${casual.letter}${casual.letter}-####-${casual.letter}-##`
  return casual.numerify(string)
})

casual.define('id', (digits) => {
  return require('crypto').randomBytes(digits).toString('hex')
})

describe('App rendering', () => {
  it ('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
  })

  it ('renders the fetch product search', () => {
    mount(<FetchProduct />)
  })
  it ('renders the products list', () => {
    const data = [
      {
        id: casual.id(10),
        title: casual.title,
        ASIN: casual.asin
      }
    ]
    mount(<Products data={data}/>)
  })

  it ('renders the product page', () => {
    const data = {
      id: casual.id(10),
      title: casual.title,
      ASIN: casual.asin,
      rank: [
        {
          id: casual.id(5),
          text: casual.text
        }
      ]
    }
    mount (<Product data={data} match={{params: { productId: data.id}}} />)
  })
})

