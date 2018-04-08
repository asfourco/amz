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
          return Object.assign({}, prev.products, newProduct)
        } else {
          return prev
        }
      }
    })
  }
  render () {
    const { data: { loading, error, products } } = this.props

    if (loading) {
      return <p>Loading ... </p>
    }

    if (error) {
      return <p>{error.message}</p>
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
                          <h5>Title</h5>{item.title}<br />
                          <h5>RANK:</h5> {item.rank}
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
        rank
      }
    }
  `
const productSubscription = gql`
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
