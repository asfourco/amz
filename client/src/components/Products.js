import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

class Products extends Component {
  componentWillMount () {
    this.props.data.subscribeToMore({
      document: productsSubscription,
      updateQuery: (prev, {subscriptionData}) => {
        console.log(subscriptionData.data)
        if (!subscriptionData.data) {
          return prev
        }

        const newProduct = subscriptionData.data.productAdded

        if (prev.products && !prev.products.find((item) => item.id === newProduct.id)) {
          return Object.assign({}, prev, {
            product: Object.assign({}, prev.products, newProduct)
          })
        } else {
          return prev
        }
      }
    })
  }
  render () {
    const { data: { loading, error, getAllProducts: products } } = this.props

    if (loading) {
      return <p>Loading ... </p>
    }

    if (error) {
      return <p>{error.message}</p>
    }

    return (
      <div className='row'>
        <ul className='collection'>
          {
            products.map((item) => (
              <li className='collection-item' key={item.id}>
                <Link to={item.id < 0 ? `/` : `product/${item.id}`}>
                  {item.ASIN} {item.title} {item.rank}
                </Link>
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
      getAllProducts {
        id
        ASIN
        title
        rank
      }
    }
  `
const productsSubscription = gql`
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
