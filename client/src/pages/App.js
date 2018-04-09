import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import Products from '../components/Products'
import FetchProduct from '../components/FetchProduct'
import ProductSingle from '../components/Product'
import apolloClient from '../lib/apollo'

class App extends Component {
  render () {
    return (
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <div>
            <div className='navbar-fixed'>
              <nav className='blue darken-2'>
                <div className='nav-wrapper'>
                  <Link to='/' className='brand-logo center'>Amazon Demo</Link>
                  <ul className='right hide-on-med-and-down'>
                    <li><Link to='/'><i className='material-icons'>home</i></Link></li>
                  </ul>

                </div>
              </nav>

            </div>
            <div className='section'>
              <FetchProduct />
            </div>
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
