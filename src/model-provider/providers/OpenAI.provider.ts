import { IBaseInferenceSettings, IModelProvider } from '../IModelProvider';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Session } from 'src/database/entity/Session.entity';
import { PromptTemplateService } from 'src/prompt-template/prompt-template.service';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Inference } from 'src/database/entity/Inference.entity';

interface IOpenAPIProviderConfig {
  modelId: string;
  apiKey: string;
}

@Injectable()
export class OpenAIProvider extends IModelProvider<
  IOpenAPIProviderConfig,
  string | ChatCompletionRequestMessage[]
> {
  constructor(
    @Inject(forwardRef(() => PromptTemplateService))
    private promptTemplateService: PromptTemplateService,
  ) {
    super();
  }

  override async preparePrompt(
    authContext: IAuthenticatedContext,
    config: IOpenAPIProviderConfig,
    inference: Inference,
    session: Session,
  ): Promise<string | ChatCompletionRequestMessage[]> {
    if (config.modelId.startsWith('text-davinci-0')) {
      return this.promptTemplateService.compilePromptTemplateInstance(
        authContext,
        inference.promptTemplateInstance,
        session,
        inference,
      );
    } else {
      console.log('Inference Object:', inference);

      // TODO: TOOLS
      // TODO: smarter prompt parsing so you can pre and post prompt around inputs
      // This assumes history and input go after the rest of the system prompt
      const systemMsg =
        await this.promptTemplateService.compilePromptTemplateInstance(
          authContext,
          {
            ...inference.promptTemplateInstance,
            prompt: inference.promptTemplateInstance?.prompt.replace(
              '{{input}}',
              'the next message',
            ),
          },
          session,
          inference,
        );
      const messages: ChatCompletionRequestMessage[] = [
        ...(systemMsg
          ? [
              {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: systemMsg,
              },
            ]
          : []),
        ...session.inferences.flatMap((inference) => {
          return [
            {
              role: ChatCompletionRequestMessageRoleEnum.User,
              content: inference.prompt,
            },
            {
              role: ChatCompletionRequestMessageRoleEnum.Assistant,
              content: inference.response,
            },
          ];
        }),
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: inference.prompt,
        },
      ];
      return messages;
    }
  }

  async infer(
    config: IOpenAPIProviderConfig,
    prompt: string | ChatCompletionRequestMessage[],
    inferenceSettings: IBaseInferenceSettings,
  ) {
    const configuration = new Configuration({
      apiKey: config.apiKey,
    });
    const openai = new OpenAIApi(configuration);

    if (config.modelId.startsWith('text-davinci-0')) {
      console.log('Raw Prompt', prompt);
      const response = await openai.createCompletion({
        model: config.modelId,
        prompt,
        temperature: inferenceSettings.temperature,
        max_tokens: inferenceSettings.maxTokens,
        stop: inferenceSettings.stopSequence,
      });
      const responseText = response.data.choices[0].text?.trim();
      // TODO: record more info
      return { response: responseText };
    } else if (config.modelId.startsWith('gpt') && Array.isArray(prompt)) {
      const response = await openai.createChatCompletion({
        model: config.modelId,
        messages: prompt,
        temperature: inferenceSettings.temperature,
        max_tokens: inferenceSettings.maxTokens,
        stop: inferenceSettings.stopSequence,
      });
      const responseText = response.data.choices[0].message?.content.trim();
      return { response: responseText };
    }
    throw new Error('Inference not implemented for model');
  }
}
