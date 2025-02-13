import 'dotenv/config';
import { RedisOptions } from 'ioredis';

export const PORT = process.env.PORT || 4001;
export const URL_SERVICE = process.env.CHAT_SERVICE || 'http://192.168.0.15:8082';

export const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || '192.168.0.15',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
};

export const allowedOrigins = ['http://192.168.0.15:3000', 'http://localhost:3000'];