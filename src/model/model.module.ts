import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from 'src/database/entity/Model.entity';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { Org } from 'src/database/entity/Org.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model, Org]),
    forwardRef(() => ApiKeyModule),
  ],
  providers: [ModelService],
  exports: [ModelService],
  controllers: [ModelController],
})
export class ModelModule {}
