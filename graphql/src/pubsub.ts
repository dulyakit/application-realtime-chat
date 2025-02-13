import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { redisOptions } from './config';

export const pubsub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
});