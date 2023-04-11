import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptTemplate } from 'src/database/entity/PromptTemplate.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { InferenceModule } from 'src/inference/inference.module';
import { PromptTemplateService } from './prompt-template.service';
import { PromptTemplateController } from './prompt-template.controller';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { Org } from 'src/database/entity/Org.entity';
import { Tool } from 'src/database/entity/Tool.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromptTemplate,
      PromptTemplateInstance,
      Org,
      Tool,
    ]),
    forwardRef(() => InferenceModule),
    forwardRef(() => ApiKeyModule),
  ],
  providers: [PromptTemplateService],
  exports: [PromptTemplateService],
  controllers: [PromptTemplateController],
})
export class PromptTemplateModule {}
