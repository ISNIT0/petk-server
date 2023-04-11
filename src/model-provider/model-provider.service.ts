import { Injectable } from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Model } from 'src/database/entity/Model.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { Session } from 'src/database/entity/Session.entity';
import { IInferenceRequest } from 'src/session/session.service';
import { IModelProvider } from './IModelProvider';
import { OpenAIProvider } from './providers/OpenAI.provider';

@Injectable()
export class ModelProviderService {
  providers: Record<string, IModelProvider<any, any>>;
  constructor(private openAIProvider: OpenAIProvider) {
    this.providers = {
      OpenAI: openAIProvider,
    };
  }

  async infer(
    authContext: IAuthenticatedContext,
    model: Model,
    inferenceRequest: IInferenceRequest,
    promptTemplateInstance: PromptTemplateInstance,
    session: Session,
  ) {
    const provider = this.providers[model.provider];

    if (!provider)
      throw new Error(`Couldn't find provider [${model.provider}]`);

    const prompt = await provider.preparePrompt(
      authContext,
      model.config,
      inferenceRequest,
      promptTemplateInstance,
      session,
    );

    const inferenceSettings = {
      maxTokens: promptTemplateInstance.maxTokens,
      stopSequence: promptTemplateInstance.stopSequence,
      temperature: promptTemplateInstance.temperature,
    };

    return provider.infer(model.config, prompt, inferenceSettings);
  }
  async getPrompt(
    authContext: IAuthenticatedContext,
    model: Model,
    inferenceRequest: IInferenceRequest,
    promptTemplateInstance: PromptTemplateInstance,
    session: Session,
  ) {
    const provider = this.providers[model.provider];

    if (!provider)
      throw new Error(`Couldn't find provider [${model.provider}]`);

    return provider.preparePrompt(
      authContext,
      model.config,
      inferenceRequest,
      promptTemplateInstance,
      session,
    );
  }
}
