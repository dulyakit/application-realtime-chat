import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://192.168.0.15:4000/graphql',
    retryAttempts: 10, // จำนวนครั้งที่ต้องการให้ reconnect
    retryWait: (retryCount) => {
      // ระยะเวลาที่จะรอก่อน reconnect (ใน milliseconds)
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
  uri: 'http://192.168.0.15:4000/graphql',
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