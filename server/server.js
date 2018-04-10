/* eslint-disable no-new */
import express from 'express'
import graphqlHTTP from 'express-graphql'
import cors from 'cors'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { schema } from './src/schema'

const PORT = 4000
const CLIENT_PORT = 3000

const server = express()

server.use('*', cors({ origin: `http://localhost:${CLIENT_PORT}` }))

server.use('/graphql', graphqlHTTP({
  schema,
  pretty: true,
  graphiql: true,
  formatError: (error) => {
    return {
      message: error.message,
      code: error.originalError && error.originalError.code,
      path: error.path
    }
  }
}))

const webSocket = createServer(server)

webSocket.listen(PORT, () => {
  console.log(`GraphQL server running on http://localhost:${PORT}/graphql`)
  console.log(`GraphIQL server running on http://localhost:${PORT}/graphiql`)
  console.log(`GraphQL Subscriptions server running on ws://localhost:${PORT}/subscriptions`)

  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: webSocket,
    path: '/subscriptions'
  })
})
