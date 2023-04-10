import { Injectable } from '@nestjs/common';
import * as redis from 'redis';

@Injectable()
export class RedisService {
  public redisClient: Promise<redis.RedisClientType>;
  constructor() {
    const client = redis.createClient({ url: process.env.REDIS_URL });
    this.redisClient = client.connect().then(() => client) as any;
  }
  async set(key: string, value: string, expireAfterSeconds?: number) {
    if (expireAfterSeconds) {
      await (await this.redisClient).set(key, value);
      await (await this.redisClient).expire(key, expireAfterSeconds);
    } else {
      await (await this.redisClient).set(key, value);
    }
  }

  async keys(keyPattern: string) {
    // TODO: Scan
    return await (await this.redisClient).keys(keyPattern);
  }

  async delete(keyPattern: string) {
    const keysToDelete = keyPattern.includes('*')
      ? await this.keys(keyPattern)
      : [keyPattern];
    return (await this.redisClient).del(keysToDelete);
  }

  async mget<T extends number | string>(key: string[]): Promise<T[]> {
    return (await this.redisClient).mGet(key) as Promise<T[]>;
  }

  async get<T extends number | string>(key: string): Promise<T> {
    return (await this.redisClient).get(key) as Promise<T>;
  }

  async increment(key: string) {
    return (await this.redisClient).incr(key);
  }
}
