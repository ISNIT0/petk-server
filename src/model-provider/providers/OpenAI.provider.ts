import { IBaseInferenceSettings, IModelProvider } from '../IModelProvider';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { IInferenceRequest } from 'src/session/session.service';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { Session } from 'src/database/entity/Session.entity';
import { PromptTemplateService } from 'src/prompt-template/prompt-template.service';

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
    config: IOpenAPIProviderConfig,
    inferenceRequest: IInferenceRequest,
    promptTemplate: PromptTemplateInstance,
    session: Session,
  ): Promise<string | ChatCompletionRequestMessage[]> {
    if (config.modelId.startsWith('text-davinci-0')) {
      return this.promptTemplateService.compilePromptTemplateInstance(
        promptTemplate,
        session,
        inferenceRequest.prompt,
      );
    } else {
      // TODO: TOOLS
      // TODO: smarter prompt parsing so you can pre and post prompt around inputs
      // This assumes history and input go after the rest of the system prompt
      const systemMsg = promptTemplate.prompt
        .replace('{tools}', '')
        .replace('{tool_names}', '')
        .replace('{history}', '')
        .replace('{input}', '');
      const messages: ChatCompletionRequestMessage[] = [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: systemMsg,
        },
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
          content: inferenceRequest.prompt,
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
