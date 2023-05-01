import { Module } from '@nestjs/common';
import { InferenceRatingService } from './inference-rating.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inference } from 'src/database/entity/Inference.entity';
import { InferenceRating } from 'src/database/entity/InferenceRating.entity';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inference, InferenceRating]),
    ApiKeyModule,
  ],
  providers: [InferenceRatingService],
  exports: [InferenceRatingService],
})
export class InferenceRatingModule {}
