import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ReviewList from './ReviewList'
import { productSubscription } from './Products'

class Product extends Component {
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
            products: [  ...prev.products, newProduct ]
          })
        } else {
          return prev
        }
      }
    })
  }

  renderTitle = (product) => {
    return (
      <div className='row'>
        <h4>{product.title}</h4>
        <p>(ASIN: {product.ASIN})</p>
        <blockquote>
          <h5>RANK:</h5>
          <ul>
            {
              product.rank.map((rankItem) => (
                <li key={rankItem.id}>
                  {rankItem.text}
                </li>
              ))
            }
          </ul>
        </blockquote>
      </div>
    )
  }

  render () {
    const { data: { loading, error, getProductById: product } } = this.props

    if (loading) {
      return <p>Loading ...</p>
    }
    if (error) {
      return <p>{error.message}</p>
    }

    return (
      <div className='container'>
        {this.renderTitle(product)}
        <ReviewList productId={product.id} />
      </div>
    )
  }
}

export const productQuery = gql`
  query ProductSingleQuery($productId: ID!) {
    getProductById(id: $productId) {
      id
      ASIN
      title
      rank {
        id
        text
      }
    }
  }
`

export default (graphql(productQuery, {
  options: (props) => ({
    variables: {
      productId: props.match.params.productId
    }
  })
})(Product))
