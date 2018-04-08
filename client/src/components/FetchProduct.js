import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { productsListQuery } from './Products'

const util = require('util')
class FetchProduct extends Component {
  componentWillMount(){
    this.setState({ASIN: ''})
  }


  handleSave = ({ mutate }) => {
  const { ASIN } = this.state
  this.props.mutate({
      variables: {ASIN},
      update: (store, { data: {fetchProductFromAWS: fetchedProduct}}) => {
        const data = store.readQuery({ query: productsListQuery })
        console.log('/***** data:', util.inspect(data, {showHidden:true, depth:null}))
        data.products.push(fetchedProduct)
        store.writeQuery({query: productsListQuery, data})
      }
    })
    .then(() => {
      this.setState({
        ASIN: ''
      })
    })
}

render () {
  return (
    <div className="row">
      <div className="col s12">

      <div className="col s5 offset-s3">
        <input
          value={this.state.ASIN}
          placeholder='Amazon Product ASIN'
          onChange={(e) => this.setState({ASIN: e.target.value})}
        />
      </div>
      <div className="col s3">
        <button
          onClick={this.handleSave}
          className="btn-small waves-effect waves-light orange accent-2"
          type="submit"
        >
          Fetch Product
        </button>
      </div>
    </div>
    </div>


  )
}
}

const fetchProduct = gql`
    mutation FetchProduct($ASIN: String!) {
        fetchProductFromAWS(ASIN: $ASIN) {
            id
            ASIN
            title
            rank
        }
    }
`

const AddProductsWithMutation = graphql(fetchProduct)(FetchProduct)
export default AddProductsWithMutation