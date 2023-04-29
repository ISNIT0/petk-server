import { Injectable } from '@nestjs/common';
import { Integration } from 'src/database/entity/Integration.entity';
import { Model } from 'src/database/entity/Model.entity';
import { IIntegrationDefinition } from './IIntegrationDefinition';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Org } from 'src/database/entity/Org.entity';

@Injectable()
export class ConjectureDefinition extends IIntegrationDefinition {
  async createModels(
    authContext: IAuthenticatedContext,
    integration: Integration,
  ): Promise<Model[]> {
    const chatModel = new Model();
    chatModel.name = `Conjecture: chonk-v4 (chat)`;
    chatModel.provider = 'Conjecture';
    chatModel.config = { ...integration.config, modelId: 'chonk-v4' };
    chatModel.safetyConfig = integration.safetyConfig;
    chatModel.org = { id: authContext.org.id } as Org;
    chatModel.description = ``;
    chatModel.integration = integration;
    chatModel.type = 'chat';

    const instructionModel = new Model();
    instructionModel.name = `Conjecture: chonk-v4 (instruction)`;
    instructionModel.provider = 'Conjecture';
    instructionModel.config = { ...integration.config, modelId: 'chonk-v4' };
    instructionModel.safetyConfig = integration.safetyConfig;
    instructionModel.org = { id: authContext.org.id } as Org;
    instructionModel.description = ``;
    instructionModel.integration = integration;
    instructionModel.type = 'instruction';

    return [chatModel, instructionModel];
  }
}
