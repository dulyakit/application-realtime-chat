import {
  ApolloClient, createHttpLink, InMemoryCache, split,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'same-origin',
})

const wsLink = process.browser ? new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
  },
}) : null

const link = process.browser
  ? split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition'
        && definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink,
  )
  : httpLink

const client = new ApolloClient({
  cache: new InMemoryCache(),
})

export default client
