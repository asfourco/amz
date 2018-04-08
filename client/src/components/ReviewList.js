import React from 'react'

const ReviewList = ({ reviews }) => {
  console.log({reviews})
  return (
    <ul>
      { reviews.map(item => (<li key={item.id}> rating:{item.rating} title:{item.title} author:{item.author}</li>)
      )}
    </ul>
  )
}

export default ReviewList
