import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inference } from 'src/database/entity/Inference.entity';
import { Session } from 'src/database/entity/Session.entity';
import { ModelProviderModule } from 'src/model-provider/model-provider.module';
import { ModelModule } from 'src/model/model.module';
import { ProfileModule } from 'src/profile/profile.module';
import { PromptTemplateModule } from 'src/prompt-template/prompt-template.module';
import { InferenceService } from './inference.service';
import { ToolModule } from 'src/tool/tool.module';
import { Tool } from 'src/database/entity/Tool.entity';
import { InferenceController } from './inference.controller';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    forwardRef(() => PromptTemplateModule),
    ModelModule,
    ModelProviderModule,
    ProfileModule,
    TypeOrmModule.forFeature([Session, Inference, Tool]),
    ToolModule,
    ApiKeyModule,
    forwardRef(() => SessionModule),
  ],
  providers: [InferenceService],
  exports: [InferenceService],
  controllers: [InferenceController],
})
export class InferenceModule {}
