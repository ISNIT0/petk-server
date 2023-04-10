import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { Integration } from 'src/database/entity/Integration.entity';
import { Model } from 'src/database/entity/Model.entity';
import { IIntegrationDefinition } from './IIntegrationDefinition';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Org } from 'src/database/entity/Org.entity';

@Injectable()
export class OpenAIDefinition extends IIntegrationDefinition {
  async createModels(
    authContext: IAuthenticatedContext,
    integration: Integration,
  ): Promise<Model[]> {
    const configuration = new Configuration({
      apiKey: integration.config.apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const _models = await openai.listModels();

    const models = _models.data.data.flatMap((model) => {
      if (model.id.startsWith('text-davinci-0')) {
        return [
          { ...model, name: `${model.id} (Instruction)`, type: 'instruction' },
          { ...model, name: `${model.id} (Chat)`, type: 'chat' },
        ];
      }
      if (model.id.startsWith('gpt')) {
        return [{ ...model, name: model.id, type: 'chat' }];
      }
      return [];
    });

    return models.map((oaiModel) => {
      const model = new Model();
      model.name = `OpenAI: ${oaiModel.name}`;
      model.provider = 'OpenAI';
      model.config = { ...integration.config, modelId: oaiModel.id };
      model.safetyConfig = integration.safetyConfig;
      model.org = { id: authContext.org.id } as Org;
      model.description = ``;
      model.integration = integration;
      model.type = oaiModel.type as any;

      return model;
    });
  }
}
