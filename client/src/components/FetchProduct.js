import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { productsListQuery } from './Products'
import ErrorModal from '../modals/ErrorModal'

class FetchProduct extends Component {
  componentWillMount(){
    this.setState({
      ASIN: '',
      isFetching: false,
      error: false,
      errorMsg: ''
    })
  }

  handleSave = () => {
    const { ASIN } = this.state
    this.setState({isFetching: true})

    this.props.mutate({
        variables: {ASIN},
        update: (store, {
          data: {
            loading,
            error,
            fetchProductFromAWS: fetchedProduct
        }}) => {
          this.setState({isFetching: false})

          if (fetchedProduct === null) {
            this.setState({
              error: true,
              errorMsg: `Sorry, we already have that product saved.\nPlease try another ASIN`
            })
            return
          }

          if (fetchedProduct === undefined ) {
            this.setState({
              error: true,
              errorMsg: `Sorry, could not find the product.\nPlease try another ASIN`
            })
            return
          }

          const data = store.readQuery({ query: productsListQuery })
          data.products.push(fetchedProduct)
          store.writeQuery({query: productsListQuery, data})
          this.props.history.push(`/product/${fetchedProduct.id}`)
        }
      })
      .then(() => {
        this.setState({
          ASIN: ''
        })
      })
  }


  render () {
    const {
      isFetching,
      error,
      errorMsg,
      ASIN
    } = this.state

    return (
      <div>
        <ErrorModal
          openModal={error}
          message={errorMsg}
        />
        <div className="row">
          <div className="col s12">
            <div className="col s5 offset-s3">
              <input
                value={ASIN}
                placeholder='Amazon Product ASIN'
                onChange={(e) => this.setState({ASIN: e.target.value})}
                onKeyUp={(e) => (e.keyCode === 13) ? this.handleSave() : null}
              />
            </div>
            <div className="col s2">
              <button
                onClick={this.handleSave}
                className="btn waves-effect waves-light orange accent-2"
                type="submit"
              >
                <i className='material-icons'>search</i>
              </button>
            </div>
          </div>
        </div>
          {isFetching &&
          <div className='row'>
            <div className='progress col s5 offset-s3'>
              <div className='indeterminate'></div>
            </div>
          </div>
          }
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
            rank {
                id
                text
            }
        }
    }
`

export default graphql(fetchProduct)(withRouter(FetchProduct))