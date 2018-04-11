// @flow
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

// Type definitions
type Props = {
  data: {
    subscribeToMore: Function,
    error: Object,
    products: [
      {
        id: string | number,
        title: string,
        ASIN: string
      }
    ]
  }
}

class Products extends Component<Props> {
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

    if (error) {
      return (
        <div className='row' id='Products'>
          <p>{error.message}</p>
        </div>
      )
    }

    if (!products || products.length === 0) {
      return (
        <div className='row' id='Products'>
          <div className='col l4 offset-l4'>
            <p>No products ... do you have one in mind?</p>
          </div>
        </div>
      )
    }
    return (
      <div className='row' id='Products'>
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
                      <div className='col l12 s12 left'>
                        <blockquote>
                          <h5>Title</h5>
                          <p className='truncate'>{item.title}</p>
                        </blockquote>
                      </div>

                    </div>
                  </div>
                  <div className='card-action'>
                    <Link to={`product/${item.id}`}>
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

// graphql commands
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
