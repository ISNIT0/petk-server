import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Integration } from 'src/database/entity/Integration.entity';
import { Model } from 'src/database/entity/Model.entity';
import { Org } from 'src/database/entity/Org.entity';
import { Repository } from 'typeorm';
import { IIntegrationDefinition } from './integrationDefinitions/IIntegrationDefinition';
import { OpenAIDefinition } from './integrationDefinitions/OpenAIDefinition';

@Injectable()
export class IntegrationService {
  definitions: Record<string, IIntegrationDefinition>;

  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    @InjectRepository(Integration)
    private integrationRepository: Repository<Integration>,

    private openAIDefinition: OpenAIDefinition,
  ) {
    this.definitions = {
      OpenAI: this.openAIDefinition,
    };
  }

  async getAll(authContext: IAuthenticatedContext) {
    const integrations = await this.integrationRepository.find({
      where: { org: { id: authContext.org.id } },
    });

    return integrations;
  }

  async refreshByProvider(
    authContext: IAuthenticatedContext,
    provider: string,
  ) {
    const integration = await this.integrationRepository.findOne({
      where: {
        org: { id: authContext.org.id },
        provider: provider as any,
      },
    });
    await this.repopulateModels(authContext, integration);
    return {};
  }

  async updateByProvider(
    authContext: IAuthenticatedContext,
    provider: string,
    update: any,
  ) {
    let integration = await this.integrationRepository.findOne({
      where: {
        org: { id: authContext.org.id },
        provider: provider as any,
      },
    });
    if (!integration) {
      integration = new Integration();
    }

    integration.org = { id: authContext.org.id } as Org;
    integration.provider = provider as any;
    integration.config = update.config;
    integration.safetyConfig = update.safetyConfig;

    integration = await this.integrationRepository.save(integration);

    await this.repopulateModels(authContext, integration);

    return integration;
  }

  async repopulateModels(
    authContext: IAuthenticatedContext,
    integration: Integration,
  ) {
    const newModels = await this.definitions[integration.provider].createModels(
      authContext,
      integration,
    );

    const existingModels = await this.modelRepository.find({
      where: {
        integration: { id: integration.id },
        org: { id: authContext.org.id },
      },
    });

    const merged = newModels.map((newModel) => {
      const existingModel = existingModels.find(
        (eModel) => eModel.name === newModel.name,
      );
      if (existingModel) {
        return Object.assign(existingModel, newModel);
      } else {
        return newModel;
      }
    });

    await this.modelRepository.save(merged);
  }
}
