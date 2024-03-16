import { PubSub } from 'graphql-subscriptions';
import gql from 'graphql-tag';
import { makeExecutableSchema } from '@graphql-tools/schema';
import axios from 'axios';

const URL_SERVICE = 'http://localhost:8080';
const pubsub = new PubSub();

const typeDefs = gql`
  type NewsMessage {
    text: String
    sender: String
    receiver: String
  }

  type Query {
    placeholder: Boolean
  }

  type Mutation {
    newMessage(text: String, sender: String, receiver: String): NewsMessage
  }

  type Subscription {
    newsFeed: NewsMessage
  }
`;

interface newMessageInput {
  title: string;
  description: string;
}

const resolvers = {
  Query: {
    placeholder: () => {
      return true;
    },
  },
  Mutation: {
    newMessage: async (_parent: any, args: newMessageInput) => {
      const { data } = await axios.post(`${URL_SERVICE}/messages`, args);
      console.log(data);

      pubsub.publish('EVENT_CREATED', { newsFeed: data });

      // Save news events to a database: you can do that here!

      // Create something : EVENT_CREATED
      // Subscribe to something: EVENT_CREATED
      return args;
    },
  },
  Subscription: {
    newsFeed: {
      subscribe: () => pubsub.asyncIterator(['EVENT_CREATED']),
    },
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });
