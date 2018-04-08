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
