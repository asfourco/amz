import { toIdValue, getMainDefinition } from 'apollo-utilities'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'

const API_SERVER_PORT = 4000

// Create an http link:
const httpLink = new HttpLink({
  uri: `http://localhost:${API_SERVER_PORT}/graphql`
})

// Create a WebSocket link:
const wsLink = process.browser ? 
  new WebSocketLink({
    uri: `ws://localhost:${API_SERVER_PORT}/subscriptions`,
    options: {
      reconnect: true
    }
  }) : null

const link = process.browser ? 
  split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  ) : httpLink


const dataIdFromObject = (result) => {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`
    }
  }

  return null
}

const cache = new InMemoryCache({
  dataIdFromObject,
  cacheRedirects: {
    Query: {
      channel: (_, args) => {
        return toIdValue(
          cache.config.dataIdFromObject({
            __typename: 'Product',
            id: args.id
          })
        )
      }
    }
  }
})

const client = new ApolloClient({
  ssrMode: !process.browser,
  link,
  cache
})

export default client
