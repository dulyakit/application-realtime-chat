// src/schema/resolvers.ts
import axios from 'axios';
import { pubsub } from '../pubsub';
import { URL_SERVICE } from '../config';

interface newMessageInput {
  text: string;
  sender: number; // ยังคงเป็น number
  receiver: number;
}

interface getMessageInput {
    sender: number;
    receiver: number;
}

export const resolvers = {
  Query: {
    getMessage: async (_parent: any, args: getMessageInput, context: any) => { // Add context
      try {
        // Ensure the user is authenticated
        // if (!context.userId) {
        //   throw new Error('Not authorized!');
        // }

        // Optional: Verify that the user is allowed to access this conversation
        // (e.g., check if context.userId is either args.sender or args.receiver)

        const { data } = await axios.post(`${URL_SERVICE}/chat`, args);
        return { data };
      } catch (error) {
        console.error('Error fetching message:', error);
        throw new Error('Failed to fetch message');
      }
    },
  },
  Mutation: {
    newMessage: async (_parent: any, args: newMessageInput, context: any) => { // Add context
      try {
        // Use context.userId as the sender
        // if (!context.userId) {
        //   throw new Error('Not authorized!');
        // }

        const { data } = await axios.post(`${URL_SERVICE}/messages`, {
          ...args, // Spread the existing arguments
          sender: args.sender, // Override sender with context.userId
        });

        // Publish to a SINGLE channel: "MESSAGES"
        pubsub.publish('MESSAGES', {
          getRealtimeMessage: { data },
          sender: args.sender,   // Use context.userId for sender
          receiver: args.receiver, // Keep receiver from the arguments
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
      subscribe: async (_parent: any, args: { receiver: number }, context: any) => { //add context
        // if (!context.userId) {
        //   throw new Error('Not authorized!');
        // }
        return pubsub.asyncIterator(['MESSAGES']);
      },
      resolve: (payload: any, args: any, context: any) => {
        if (
          args.sender === payload.sender ||
          args.sender === payload.receiver
        ) {
          return payload.getRealtimeMessage;
        }
        return null;
      },
    },
  },
};