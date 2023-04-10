import { Module } from '@nestjs/common';
import { PromptTemplateModule } from 'src/prompt-template/prompt-template.module';
import { IModelProvider } from './IModelProvider';
import { ModelProviderService } from './model-provider.service';
import { OpenAIProvider } from './providers/OpenAI.provider';

@Module({
  imports: [PromptTemplateModule],
  providers: [ModelProviderService, IModelProvider, OpenAIProvider],
  exports: [ModelProviderService],
})
export class ModelProviderModule {}
