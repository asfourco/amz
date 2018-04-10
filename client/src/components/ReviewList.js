import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class ReviewsList extends Component {
  componentWillMount () {
    this.props.data.subscribeToMore({
      document: reviewsSubscription,
      variables: {
        productId: this.props.productId
      },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newReview = subscriptionData.data.productReviewAdded

        if (prev.reviews && !prev.reviews.find((item) => item.id === newReview.id)) {
          console.log(`adding newReview`)
          return Object.assign({}, prev, {
            reviews: [ ...prev.reviews, newReview ]
          })
        } else {
          return prev
        }
      }
    })
  }

  render () {
    const { data: { error, reviews } } = this.props

    if (error) {
      return <p>{error.message}</p>
    }

    if (!reviews || reviews.length === 0) {
      return (
        <p>No reviews ... perhaps I'm processing them?</p>
      )
    }

    return (

      <ul className='collection' id='Reviews'>
        {
          reviews.map(item => (
            <li key={item.id} className='collection-item'>
              <div>
                <h5>{item.title}</h5>
                <p>rating: {item.rating}</p>
                <blockquote>{item.text}</blockquote>
                <em>- {item.author} / {formatDate(item.date)}</em>
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

const formatDate = (dateString) => {
  return dateString.split('T')[0]
}

export default (graphql(productReviewQuery, {
  options: (props) => ({
    variables: {
      productId: props.productId
    }
  })
})(ReviewsList))
