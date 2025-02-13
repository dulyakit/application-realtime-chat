import gql from 'graphql-tag'

export const typeDefs = gql`
  type Message {
    text: String
    sender: Int
    receiver: Int
    createdAt: String
  }

  type Chat {
    data: [Message]
  }

  type Query {
    getMessage(sender: Int!, receiver: Int!): Chat
  }

  type Mutation {
    newMessage(text: String!, sender: Int!, receiver: Int!): Chat
  }

  type Subscription {
    getRealtimeMessage(receiver: Int!): Chat
  }
`
