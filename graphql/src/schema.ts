import { PubSub } from 'graphql-subscriptions';
import gql from 'graphql-tag';
import { makeExecutableSchema } from '@graphql-tools/schema';
import axios from 'axios';

const URL_SERVICE = 'http://localhost:8080';
const pubsub = new PubSub();

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
`;

interface newMessageInput {
  text: string;
  sender: Number;
  receiver: Number;
}

interface getMessageInput {
  sender: Number;
  receiver: Number;
}

const resolvers = {
  Query: {
    getMessage: async (_parent: any, args: getMessageInput) => {
      try {
        const { data } = await axios.post(`${URL_SERVICE}/chat`, args);
        return { data };
      } catch (error) {
        console.error('Error fetching message:', error);
        throw new Error('Failed to fetch message');
      }
    },
  },
  Mutation: {
    newMessage: async (_parent: any, args: newMessageInput) => {
      try {
        const { data } = await axios.post(`${URL_SERVICE}/messages`, args);

        pubsub.publish(`EVENT_USER_${args.sender}_TO_${args.receiver}`, {
          getRealtimeMessage: { data },
        });

        return { data };
      } catch (error) {
        console.error('Error creating new message:', error);
        throw new Error('Failed to create message');
      }
    },
  },
  Subscription: {
    getRealtimeMessage: {
      subscribe: async (_parent: any, args: getMessageInput) =>
        pubsub.asyncIterator([
          `EVENT_USER_${args.sender}_TO_${args.receiver}`,
          `EVENT_USER_${args.receiver}_TO_${args.sender}`,
        ]),
    },
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });
