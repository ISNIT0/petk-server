import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inference } from 'src/database/entity/Inference.entity';
import { Session } from 'src/database/entity/Session.entity';
import { ModelProviderModule } from 'src/model-provider/model-provider.module';
import { ModelModule } from 'src/model/model.module';
import { ProfileModule } from 'src/profile/profile.module';
import { PromptTemplateModule } from 'src/prompt-template/prompt-template.module';
import { InferenceService } from './inference.service';

@Module({
  imports: [
    forwardRef(() => PromptTemplateModule),
    ModelModule,
    ModelProviderModule,
    ProfileModule,
    TypeOrmModule.forFeature([Session, Inference]),
  ],
  providers: [InferenceService],
  exports: [InferenceService],
})
export class InferenceModule {}
