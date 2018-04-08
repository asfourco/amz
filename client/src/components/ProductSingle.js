import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ReviewList from './ReviewList'

class ProductSingle extends Component {
  renderTitle (product) {
    return (
      <div className='row'>
        <h4>{product.title}</h4>
        <p>(ASIN: {product.ASIN})</p>
      </div>
    )
  }

  render () {
    const { data: { loading, error, getProductById: product } } = this.props

    if (loading) {
      return (
        <div className='preloader-wrapper big active'>
          <div className='spinner-layer spinner-blue-only'>
            <div className='circle-clipper left'>
              <div className='circle' />
            </div>
            <div className='gap-patch'>
              <div className='circle' />
            </div>
            <div className='circle-clipper right'>
              <div className='circle' />
            </div>
          </div>
        </div>

      )
    }

    if (error) {
      return <p>{error.message}</p>
    }

    if (product.reviews === null) this.renderTitle(product)

    return (
      <div className='container'>
        {this.renderTitle(product)}
        <ReviewList productId={product.id} />
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

export default (graphql(productSingleQuery, {
  options: (props) => ({
    variables: {
      productId: props.match.params.productId
    }
  })
})(ProductSingle))
