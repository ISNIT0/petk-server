import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

// TODO: Use official NestJS Redis service.
// I can't download it because I'm on an 'plane

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
