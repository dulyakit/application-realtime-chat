import Redis from 'ioredis';
import { redisOptions } from './config';

const connectionManagerRedis = new Redis(redisOptions);
const CONNECTION_PREFIX = 'connection:';

export async function storeConnection(userId: string | number, connectionId: string) {
  await connectionManagerRedis.sadd(`${CONNECTION_PREFIX}${userId}`, connectionId);
}

export async function removeConnection(userId: string | number, connectionId: string) {
  await connectionManagerRedis.srem(`${CONNECTION_PREFIX}${userId}`, connectionId);
}

export async function getConnections(userId: string | number): Promise<string[]> {
  return connectionManagerRedis.smembers(`${CONNECTION_PREFIX}${userId}`);
}