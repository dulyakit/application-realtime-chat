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
    message(sender: Int, receiver: Int): Chat
  }
`;

interface newMessageInput {
  text: string;
  sender: Number;
  receiver: Number;
}

interface subscribeInput {
  sender: Number, 
  receiver: Number
}

const resolvers = {
  Query: {
    getMessage: async (_parent: any, args: subscribeInput) => {
      const { data } = await axios.post(`${URL_SERVICE}/chat`, args);
      return { data };
    },
  },
  Mutation: {
    newMessage: async (_parent: any, args: newMessageInput) => {
      const { data } = await axios.post(`${URL_SERVICE}/messages`, args);
      pubsub.publish(`EVENT_USER_${args.sender}_TO_${args.receiver}`, { message: { data } });
      return { data };
    },
  },
  Subscription: {
    message: {
      subscribe: (_parent: any, args: subscribeInput) => pubsub.asyncIterator([`EVENT_USER_${args.sender}_TO_${args.receiver}`]),
    },
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });
