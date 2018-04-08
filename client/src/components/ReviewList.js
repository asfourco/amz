import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
const util = require('util')

class ReviewsList extends Component {
  componentWillMount () {
    this.props.data.subscribeToMore({
      document: reviewsSubscription,
      variables: {
        productId: this.props.productId
      },
      updateQuery: (prev, {subscriptionData}) => {
        console.log(`/***** ${util.inspect(prev, {showHidden: true, depth: null})}`)
        console.log(`/***** ${util.inspect(subscriptionData, {showHidden: true, depth: null})}`)
        if (!subscriptionData.data) {
          return prev
        }

        const newReview = subscriptionData.data.productReviewAdded

        if (prev.reviews && !prev.reviews.find((item) => item.id === newReview.id)) {
          console.log(`adding newReview`)
          return Object.assign({}, prev, {
            reviews: [ newReview, ...prev.reviews ]
          })
        } else {
          return prev
        }
      }
    })
  }

  render () {
    const { data: { loading, error, reviews } } = this.props
    console.log(`/**** reviews => ${util.inspect(reviews, {showHidden: true, depth: null})}`)
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

    if (reviews === null || reviews.length === 0) {
      return (
        <p>No reviews</p>
      )
    }

    return (

      <ul className='collection'>
        {
          reviews.map(item => (
            <li key={item.id} className='collection-item'>
              <div>
                <h5>{item.title}</h5>
                <p>rating: {item.rating}</p>
                <blockquote>{item.text}</blockquote>
                <em>- {item.author} / {item.date}</em>
              </div>
            </li>
          ))
        }
      </ul>
    )
  }
}

const productReviewQuery = gql`
    query ProductReviewQuery($productId: ID!) {
        reviews(productId: $productId) {
                id
                title
                text
                author
                date
                rating
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

export default (graphql(productReviewQuery, {
  options: (props) => ({
    variables: {
      productId: props.productId
    }
  })
})(ReviewsList))
