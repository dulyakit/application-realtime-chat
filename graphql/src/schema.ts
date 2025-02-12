import gql from 'graphql-tag'
import { makeExecutableSchema } from '@graphql-tools/schema'
import axios from 'axios'
import { RedisPubSub } from 'graphql-redis-subscriptions' // Import RedisPubSub
import Redis from 'ioredis'
require('dotenv').config()

const URL_SERVICE = process.env.CHAT_SERVICE || 'http://192.168.0.15:8082'

// --- Redis Configuration ---
const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => {
    return Math.min(times * 50, 2000)
  },
}

const pubsub = new RedisPubSub({
  // Use RedisPubSub
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
})

// --- End Redis Configuration ---

const typeDefs = gql`
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
    getMessage(sender: Int, receiver: Int): Chat
  }

  type Mutation {
    newMessage(text: String, sender: Int, receiver: Int): Chat
  }

  type Subscription {
    getRealtimeMessage(sender: Int, receiver: Int): Chat
  }
`

interface newMessageInput {
  text: string
  sender: Number
  receiver: Number
}

interface getMessageInput {
  sender: Number
  receiver: Number
}

const resolvers = {
  Query: {
    getMessage: async (_parent: any, args: getMessageInput) => {
      try {
        const { data } = await axios.post(`${URL_SERVICE}/chat`, args)
        return { data }
      } catch (error) {
        console.error('Error fetching message:', error)
        throw new Error('Failed to fetch message')
      }
    },
  },
  Mutation: {
    newMessage: async (_parent: any, args: newMessageInput) => {
      try {
        const { data } = await axios.post(`${URL_SERVICE}/messages`, args)

        pubsub.publish(`EVENT_USER_${args.sender}_TO_${args.receiver}`, {
          getRealtimeMessage: { data },
        })

        return { data }
      } catch (error) {
        console.error('Error creating new message:', error)
        throw new Error('Failed to create message')
      }
    },
  },
  Subscription: {
    getRealtimeMessage: {
      subscribe: async (_parent: any, args: getMessageInput) => {
        return pubsub.asyncIterator([
          `EVENT_USER_${args.sender}_TO_${args.receiver}`,
          `EVENT_USER_${args.receiver}_TO_${args.sender}`,
        ])
      },
    },
  },
}

export default makeExecutableSchema({ typeDefs, resolvers })
