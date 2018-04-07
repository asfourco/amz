/* eslint-disable no-new */
import express from 'express'
import bodyParser from 'body-parser'
import {
  graphqlExpress,
  graphiqlExpress
} from 'apollo-server-express'
import cors from 'cors'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { schema } from './src/schema'

const PORT = 4000
const CLIENT_PORT = 3000

const server = express()

server.use('*', cors({ origin: `http://localhost:${CLIENT_PORT}` }))

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
server.use('/graphiql', bodyParser.json(), graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
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
