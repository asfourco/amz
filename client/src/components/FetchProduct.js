// @flow
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { productsListQuery } from './Products'
import ErrorModal from '../modals/ErrorModal'

// Type definitions
type Props = {
  mutate: Function,
  location: {
    pathname: string
  },
  history: Object
}

type State = {
  ASIN: string,
  isFetching: boolean,
  error: boolean,
  errorMsg: string
}

class FetchProduct extends Component<Props, State> {
  componentWillMount () {
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
      update: (store, { data: { fetchProductFromAWS: fetchedProduct } }) => {
        this.setState({isFetching: false})

        // if we're on the products list page then add to the presentation layer
        if (this.props.location.pathname === '/') {
          const data = store.readQuery({ query: productsListQuery })
          data.products.push(fetchedProduct)
          store.writeQuery({query: productsListQuery, data})
        }

        this.props.history.push(`/product/${fetchedProduct.id}`)
      }
    })
      .then(() => {
        this.setState({
          ASIN: ''
        })
      })
      .catch((res) => {
        this.setState({isFetching: false, error: true})
        res.graphQLErrors.map((error) => {
          let errorMsg = ''
          switch (error.code) {
            case 404:
              errorMsg = `Sorry, could not find the product.\nPlease try another ASIN`
              break
            case 420:
              errorMsg = `Sorry, we already have that product saved.\nPlease try another ASIN`
              break
            default: errorMsg = error.message
          }

          this.setState({ errorMsg })
        })
      })
  }

  render () {
    return (
      <div id="FetchProduct">
        <ErrorModal
          show={this.state.error}
          message={this.state.errorMsg}
          onClose={() => this.setState({error: !this.state.error})}
        />
        <div className="row">
          <div className="col s12">
            <div className="col s5 offset-s3">
              <input
                value={this.state.ASIN}
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
        {this.state.isFetching &&
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

// graphql command
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
