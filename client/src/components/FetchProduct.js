import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { productsListQuery } from './Products'

class FetchProduct extends Component {
  state = {
    ASIN: ''
  }

  handleSave = ({ mutate }) => {
    const { ASIN } = this.state
    this.props.mutate({
      variables: {ASIN},
      update: (store, { data: {fetchProductFromAWS}}) => {
        const data = store.readQuery({ query: productsListQuery })
        data.getAllProducts.push(fetchProductFromAWS)
        store.writeQuery({query: productsListQuery, data})
      }
    })
    .then( res => {
      this.setState({
        ASIN: ''
      })
    })
  }

  render () {
    return (
        <div className="row">
          <div className="col s5">
            <input
                value={this.state.ASIN}
                placeholder='Amazon Product ASIN'
                onChange={(e) => this.setState({ASIN: e.target.value})}
            />
          </div>
          <div className="col s5">
            <button
                onClick={(this.handleSave)}
                className="btn waves-effect waves-light"
                type="submit"
            >
              Fetch Product
            </button>
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
