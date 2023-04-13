import { Module } from '@nestjs/common';
import { InferenceSentinelService } from './inference-sentinel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from 'src/database/entity/Model.entity';
import { SentinelSetting } from 'src/database/entity/SentinelSetting.entity';
import { PiiDetectorModule } from 'src/pii-detector/pii-detector.module';
import { InferenceWarning } from 'src/database/entity/InferenceWarning.entity';
import { InferenceSentinelController } from './inference-sentinel.controller';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model, SentinelSetting, InferenceWarning]),
    PiiDetectorModule,
    ApiKeyModule,
  ],
  providers: [InferenceSentinelService],
  exports: [InferenceSentinelService],
  controllers: [InferenceSentinelController],
})
export class InferenceSentinelModule {}
