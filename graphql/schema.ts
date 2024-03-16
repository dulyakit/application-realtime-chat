import { PubSub } from 'graphql-subscriptions';
import gql from 'graphql-tag';
import { makeExecutableSchema } from '@graphql-tools/schema';

const pubsub = new PubSub();

const typeDefs = gql`
  type NewsEvent {
    title: String
    description: String
  }

  type Query {
    placeholder: Boolean
  }

  type Mutation {
    createNewsEvent(title: String, description: String): NewsEvent
  }

  type Subscription {
    newsFeed: NewsEvent
  }
`;

interface createNewsEventInput {
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
    createNewsEvent: (_parent: any, args: createNewsEventInput) => {
      console.log(args);
      
      pubsub.publish('EVENT_CREATED', { newsFeed: args });

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
