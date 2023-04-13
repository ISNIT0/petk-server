import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APIKey } from 'src/database/entity/APIKey.entity';
import { Profile } from 'src/database/entity/Profile.entity';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { Org } from 'src/database/entity/Org.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, APIKey, Org])],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
  controllers: [ApiKeyController],
})
export class ApiKeyModule {}
