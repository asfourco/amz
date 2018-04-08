import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const ProductHeader = ({ data: { loading, error, getProductById: product } }) => {
  if (loading) {
    return <p>Loading ... </p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return (
    <div>
      <div>{product.ASIN} { product.title }</div>
    </div>
  )
}

export const productQuery = gql`
  query ProductQuery($productId: ID!) {
    getProductById(id: $productId) {
      id
      ASIN
      title
    }
  }
`

export default (graphql(productQuery, {
  options: (props) => ({
    variables: { productId: props.productId }
  })
})(ProductHeader))
