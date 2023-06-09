import { Module } from '@nestjs/common';
import { PromptTemplateModule } from 'src/prompt-template/prompt-template.module';
import { IModelProvider } from './IModelProvider';
import { ModelProviderService } from './model-provider.service';
import { OpenAIProvider } from './providers/OpenAI.provider';
import { InferenceSentinelModule } from 'src/inference-sentinel/inference-sentinel.module';
import { ConjectureProvider } from './providers/Conjecture.provider';

@Module({
  imports: [PromptTemplateModule, InferenceSentinelModule],
  providers: [
    ModelProviderService,
    IModelProvider,
    OpenAIProvider,
    ConjectureProvider,
  ],
  exports: [ModelProviderService],
})
export class ModelProviderModule {}
