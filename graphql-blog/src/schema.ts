import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from 'graphql-subscriptions';
import gql from 'graphql-tag';

const postData = [];

const pubsub = new PubSub();

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
  }

  type Query {
    posts: [Post!]!
  }

  type Mutation {
    createPost(title: String!, content: String!): Post!
  }

  type Subscription {
    postCreated: Post!
  }
`;

interface createPostInput {
  title: string;
  content: string;
}

const resolvers = {
  Query: {
    getMessage: async (_parent: any, args: getPostInput) => {
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
    newMessage: async (_parent: any, args: createPostInput) => {
      pubsub.publish(`EVENT_CREATE_POST`, {
        postCreated: { data },
      });
      return { data };
    },
  },
  Subscription: {
    postCreated: {
      subscribe: async () => pubsub.asyncIterator([`EVENT_CREATE_POST`]),
    },
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });
