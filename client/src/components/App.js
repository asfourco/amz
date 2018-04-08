import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import Products from './Products'
import FetchProduct from './FetchProduct'
import ProductSingle from './ProductSingle'
import apolloClient from '../lib/apollo'

class App extends Component {
  render () {
    return (
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <div>
            <div className='navbar-fixed'>
              <nav className='teal darken-1'>
                <div className='nav-wrapper'>
                  <Link to='/' className='brand-logo center'>Amazon Demo</Link>
                </div>
              </nav>
            </div>
            <FetchProduct />
            <Switch>
              <Route exact path='/' component={Products} />
              <Route path='/product/:productId' component={ProductSingle} />
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    )
  }
}

export default App
