import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ReviewList from './ReviewList'
import ProductHeader from './ProductHeader'

class ProductSingle extends Component {
  componentWillMount () {
    this.props.data.subscribeToMore({
      document: reviewsSubscription,
      variables: {
        productId: this.props.match.params.productId
      },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newReview = subscriptionData.data.productReviewAdded

        if (prev.product.reviews && !prev.product.reviews.find((item) => item.id === newReview.id)) {
          return Object.assign({}, prev, {
            product: Object.assign({}, prev.product, {
              reviews: [...prev.product.reviews, newReview]
            })
          })
        } else {
          return prev
        }
      }
    })
  }

  render () {
    const { data: { loading, error, getProductById: product }, match } = this.props
    const util = require('util')
    console.log(`product => ${util.inspect(product, {showHidden: true, depth: null})}`)
    if (loading) {
      return <ProductHeader productId={match.params.productId} />
    }

    if (error) {
      return <p>{error.message}</p>
    }

    if (product.reviews === null) {
      return (
        <div className='container'>
          <h2>{product.ASIN} {product.title}</h2>
        </div>
      )
    }

    return (
      <div className='container'>
        <div className='row'>
          <h2>{product.ASIN} {product.title}</h2>
        </div>
        <ReviewList reviews={product.reviews} />
      </div>
    )
  }
}

export const productSingleQuery = gql`
  query ProductSingleQuery($productId: ID!) {
    getProductById(id: $productId) {
      id
      ASIN
      title
      rank
      reviews {
        id
        title
        text
        author
        date
        rating
      }
    }
  }
`

const reviewsSubscription = gql`
  subscription productReviewAdded($productId: ID!) {
    productReviewAdded(productId: $productId) {
      id
      title
      text
      author
      date
      rating
    }
  }
`

export default (graphql(productSingleQuery, {
  options: (props) => ({
    variables: {
      productId: props.match.params.productId
    }
  })
})(ProductSingle))
