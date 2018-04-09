import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

class Products extends Component {
  componentWillMount () {
    this.props.data.subscribeToMore({
      document: productSubscription,
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newProduct = subscriptionData.data.productAdded

        if (prev.products && !prev.products.find((item) => item.id === newProduct.id)) {
          return Object.assign({}, prev, {
            products: [ newProduct, ...prev.products ]
          })
        } else {
          return prev
        }
      }
    })
  }

  render () {
    const { data: { error, products } } = this.props
    const util = require('util')
    console.log(`/***** products => ${util.inspect(products, {showHidden:true, depth:null})}`)
    if (error) {
      return <p>{error.message}</p>
    }

    if (!products || products.length === 0) {
      return (
        <div className='row'>
          <div className='col l4 offset-l4'>
            <p>No products ... do you have one in mind?</p>
          </div>
        </div>
      )
    }
    return (
      <div className='row'>
        <ul>
          {
            products.map((item) => (
              <li className='col l3 s12' key={item.id}>
                <div className='card hoverable'>
                  <span className='card-title'>
                    {item.ASIN}
                  </span>
                  <div className='card-content'>
                    <div className='row'>
                      <div className='col l12 left'>
                        <blockquote>
                          <h5>Title</h5>
                          <p className='truncate'>{item.title}</p>
                        </blockquote>
                      </div>

                    </div>
                  </div>
                  <div className='card-action'>
                    <Link to={item.id < 0 ? `/` : `product/${item.id}`}>
                      Read reviews
                    </Link>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export const productsListQuery = gql`
    query ProductsQuery {
      products {
        id
        ASIN
        title
      }
    }
  `
export const productSubscription = gql`
  subscription productAdded {
    productAdded {
      id
      ASIN
      title
      rank
    }
  }
`

export default graphql(productsListQuery)(Products)
