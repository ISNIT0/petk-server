import { IBaseInferenceSettings, IModelProvider } from '../IModelProvider';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import axios from 'axios';
import { Session } from 'src/database/entity/Session.entity';
import { PromptTemplateService } from 'src/prompt-template/prompt-template.service';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Inference } from 'src/database/entity/Inference.entity';

interface IConjectureAPIProviderConfig {
  modelId: string;
  apiKey: string;
}

@Injectable()
export class ConjectureProvider extends IModelProvider<
  IConjectureAPIProviderConfig,
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
    config: IConjectureAPIProviderConfig,
    inference: Inference,
    session: Session,
  ): Promise<string | ChatCompletionRequestMessage[]> {
    // TODO: TOOLS
    // TODO: smarter prompt parsing so you can pre and post prompt around inputs
    // This assumes history and input go after the rest of the system prompt
    const systemMsg =
      inference.promptTemplateInstance?.prompt
        .replace('{tools}', '')
        .replace('{tool_names}', '')
        .replace('{history}', '')
        .replace('{input}', '') || '';
    const messages: ChatCompletionRequestMessage[] = [
      ...(systemMsg
        ? [
            {
              role: ChatCompletionRequestMessageRoleEnum.Assistant,
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

  async infer(
    config: IConjectureAPIProviderConfig,
    prompt: ChatCompletionRequestMessage[],
    inferenceSettings: IBaseInferenceSettings,
  ) {
    const requestBody = {
      model: config.modelId,
      top_p: 1,
      top_k: 0,
      n: 1,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 0,
      messages: prompt,
      temperature: inferenceSettings.temperature,
      max_tokens: inferenceSettings.maxTokens,
      stop: inferenceSettings.stopSequence,
    };

    const response = await axios.post(
      `https://amplitude-predictor-predictor-default.tenant-a79620-product.knative.chi.coreweave.com/complete`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      },
    );

    const responseText = response.data.choices[0].message?.content.trim();
    return { response: responseText };
  }
}
