import { Injectable } from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Model } from 'src/database/entity/Model.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { Session } from 'src/database/entity/Session.entity';
import { IInferenceRequest } from 'src/session/session.service';
import { IModelInferenceResult, IModelProvider } from './IModelProvider';
import { OpenAIProvider } from './providers/OpenAI.provider';
import { ConjectureProvider } from './providers/Conjecture.provider';
import {
  ISentinelResult,
  InferenceSentinelService,
} from 'src/inference-sentinel/inference-sentinel.service';
import { Inference } from 'src/database/entity/Inference.entity';

export type IInferenceResult = IModelInferenceResult & {
  promptSentinelResults: ISentinelResult[];
  responseSentinelResults: ISentinelResult[];
};

@Injectable()
export class ModelProviderService {
  providers: Record<string, IModelProvider<any, any>>;
  constructor(
    private inferenceSentinelService: InferenceSentinelService,
    private openAIProvider: OpenAIProvider,
    private conjectureProvider: ConjectureProvider,
  ) {
    this.providers = {
      OpenAI: openAIProvider,
      Conjecture: conjectureProvider,
    };
  }

  async infer(
    authContext: IAuthenticatedContext,
    inference: Inference,
    session: Session,
  ): Promise<IInferenceResult> {
    const provider = this.providers[inference.model.provider];
    // TODO: apply merge data
    if (!provider)
      throw new Error(`Couldn't find provider [${inference.model.provider}]`);

    const sentinelResult =
      await this.inferenceSentinelService.checkInferencePrompt(
        authContext,
        inference,
        session,
      );

    if ('block' in sentinelResult) {
      const blockReasons = sentinelResult.results
        .filter((result) => result.action === 'block')
        .map((results) => results.category)
        .sort()
        .filter((it, i, arr) => it !== arr[i - 1]);

      return {
        promptSentinelResults: sentinelResult.results,
        responseSentinelResults: [],
        response: `Inference blocked by Prompt Sentinel: ${blockReasons.join(
          ', ',
        )}`,
        toolProfile: {
          provider: 'webhook',
          name: 'Runaway Protection',
          avatarUrl:
            'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fcrime-protection-people-rounded-1%2F110%2FPoliceman-2-4096.png&f=1&nofb=1&ipt=3c62adf20b9e9fd6fe9bed709ac57fc76e29572e108a8d3fc35b0d95e30ef6f3&ipo=images',
        },
      };
    }

    const {
      sanitizedPrompt,
      results: promptSentinelResults,
      sanitizedInferences,
      substitutions,
    } = sentinelResult;

    const prompt = await provider.preparePrompt(
      authContext,
      inference.model.config,
      { ...inference, prompt: sanitizedPrompt },
      { ...session, inferences: sanitizedInferences },
    );

    const inferenceSettings = {
      maxTokens:
        inference.maxTokensOverride ||
        inference.promptTemplateInstance?.maxTokens ||
        100,
      stopSequence:
        inference.stopSequenceOverride ||
        inference.promptTemplateInstance?.stopSequence,
      temperature:
        inference.temperatureOverride ||
        inference.promptTemplateInstance?.temperature ||
        0,
    };

    console.log(`Raw Inference Prompt: ${prompt}`);

    const inferenceResult = await provider.infer(
      inference.model.config,
      prompt,
      inferenceSettings,
    );

    console.log(`Raw Inference Response: ${inferenceResult.response}`);

    const sanitizedInferenceResult =
      await this.inferenceSentinelService.checkInferenceResult(
        inferenceResult.response,
        substitutions,
        inference.model.id,
      );

    if ('block' in sanitizedInferenceResult) {
      const blockReasons = sanitizedInferenceResult.results
        .filter((result) => result.action === 'block')
        .map((results) => results.category)
        .sort()
        .filter((it, i, arr) => it !== arr[i - 1]);
      throw new Error(
        `Inference blocked by inference sentinel: ${blockReasons.join(', ')}`,
      );
    }

    return {
      response: sanitizedInferenceResult.unsanitizedResponse,
      promptSentinelResults: promptSentinelResults,
      responseSentinelResults: sanitizedInferenceResult.results,
    };
  }

  async getPrompt(
    authContext: IAuthenticatedContext,
    model: Model,
    inference: Inference,
    session: Session,
  ) {
    const provider = this.providers[model.provider];

    if (!provider)
      throw new Error(`Couldn't find provider [${model.provider}]`);

    return provider.preparePrompt(
      authContext,
      model.config,
      inference,
      session,
    );
  }
}
