import { Injectable } from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Inference } from 'src/database/entity/Inference.entity';
import { Session } from 'src/database/entity/Session.entity';

export interface IModelInferenceResult {
  response: string;
  toolProfile?: {
    provider: string;
    name: string;
    avatarUrl: string;
  };
}

export interface IBaseInferenceSettings {
  maxTokens: number;
  stopSequence: string;
  temperature: number;
}

@Injectable()
export class IModelProvider<TModelConfig, TPromptFormat> {
  async preparePrompt(
    authContext: IAuthenticatedContext,
    config: TModelConfig,
    inference: Inference,
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
