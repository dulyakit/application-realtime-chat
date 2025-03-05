import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import 'dotenv/config'

const API_GATEWAY = process.env.API_GATEWAY || 'http://localhost:4000'

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${API_GATEWAY}/graphql`,
    retryAttempts: 10,
    retryWait: (retryCount) => {
      return new Promise((resolve) => setTimeout(resolve, 1000 * retryCount))
    },
    onError: (error) => {
      if (retryCount >= 5) {
        alert("Connection lost. Please refresh the page.");
      }
    }
  })
)

const httpLink = createHttpLink({
  uri: `http://${API_GATEWAY}/graphql`,
  credentials: 'same-origin',
})

const link = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink
    )
  : httpLink

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

export default client