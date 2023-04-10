import { Injectable } from '@nestjs/common';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { Session } from 'src/database/entity/Session.entity';
import { IInferenceRequest } from 'src/session/session.service';

export interface IModelInferenceResult {
  response: string;
}

export interface IBaseInferenceSettings {
  maxTokens: number;
  stopSequence: string;
  temperature: number;
}

@Injectable()
export class IModelProvider<TModelConfig, TPromptFormat> {
  async preparePrompt(
    config: TModelConfig,
    inferenceRequest: IInferenceRequest,
    promptTemplate: PromptTemplateInstance,
    session: Session,
  ): Promise<TPromptFormat> {
    return;
    // throw new Error(`preparePrompt not implemented for model`);
  }

  infer(
    config: TModelConfig,
    prompt: TPromptFormat,
    inferenceSettings: IBaseInferenceSettings,
  ): Promise<IModelInferenceResult> {
    throw new Error('Inference not implemented for model');
  }
}
