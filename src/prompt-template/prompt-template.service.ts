import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Org } from 'src/database/entity/Org.entity';
import { PromptTemplate } from 'src/database/entity/PromptTemplate.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { Session } from 'src/database/entity/Session.entity';
import { InferenceService } from 'src/inference/inference.service';
import { ITestInferenceRequest } from 'src/session/session.service';
import { Repository } from 'typeorm';

@Injectable()
export class PromptTemplateService {
  constructor(
    @InjectRepository(PromptTemplate)
    private promptTemplateRepository: Repository<PromptTemplate>,
    @InjectRepository(PromptTemplateInstance)
    private promptTemplateInstanceRepository: Repository<PromptTemplateInstance>,
    @InjectRepository(Org)
    private orgRepository: Repository<Org>,
    @Inject(forwardRef(() => InferenceService))
    private inferenceService: InferenceService,
  ) {}

  async getDefault(authContext: IAuthenticatedContext) {
    const { defaultChatTemplate, defaultInstructionTemplate } =
      await this.orgRepository.findOneOrFail({
        where: { id: authContext.org.id },
        relations: {
          defaultChatTemplate: true,
          defaultInstructionTemplate: true,
        },
      });

    return { defaultChatTemplate, defaultInstructionTemplate };
  }

  async getAll(authContext: IAuthenticatedContext) {
    const defaultTemplates = await this.getDefault(authContext);
    const templates = await this.promptTemplateRepository.find({
      where: {
        org: { id: authContext.org.id },
      },
      relations: { instances: true },
    });

    return templates.map((template) => {
      const isDefault =
        template.id === defaultTemplates.defaultChatTemplate?.id ||
        template.id === defaultTemplates.defaultInstructionTemplate?.id;

      template.isDefault = isDefault;
      return template;
    });
  }

  async getTemplateById(
    authContext: IAuthenticatedContext,
    templateId: string,
  ) {
    const template = await this.promptTemplateRepository.findOneOrFail({
      where: {
        org: { id: authContext.org.id },
        id: templateId,
      },
      relations: { instances: true },
    });

    return template;
  }

  async createTemplate(
    authContext: IAuthenticatedContext,
    update: {
      name: string;
      sessionType: 'chat' | 'instruction';
      description?: string;
    },
  ) {
    let instance = new PromptTemplateInstance();
    instance.prompt = '';
    instance.temperature = 0;
    instance.maxTokens = 1000;
    instance.stopSequence = null;
    instance.description = 'Default';
    instance.org = { id: authContext.org.id } as Org;
    instance = await this.promptTemplateInstanceRepository.save(instance);

    const template = new PromptTemplate();
    template.name = update.name;
    template.description = update.description || '';
    template.promptType = update.sessionType;
    template.org = { id: authContext.org.id } as Org;
    template.instances = [instance];

    return this.promptTemplateRepository.save(template);
  }

  async updateTemplateById(
    authContext: IAuthenticatedContext,
    templateId: string,
    update: { name: string },
  ) {
    const template = await this.promptTemplateRepository.findOneOrFail({
      where: {
        org: { id: authContext.org.id },
        id: templateId,
      },
    });

    template.name = update.name;

    return this.promptTemplateRepository.save(template);
  }

  async getVariantById(
    authContext: IAuthenticatedContext,
    templateId: string,
    variantId: string,
  ) {
    const template = await this.promptTemplateInstanceRepository.findOneOrFail({
      where: {
        org: { id: authContext.org.id },
        id: variantId,
        template: { id: templateId },
      },
      relations: { template: true },
    });

    return template;
  }

  async updateVariantById(
    authContext: IAuthenticatedContext,
    templateId: string,
    variantId: string,
    update: {
      prompt: string;
      temperature: number;
      maxTokens: number;
      stopSequence: string;
    },
  ) {
    const template = await this.promptTemplateInstanceRepository.findOneOrFail({
      where: {
        org: { id: authContext.org.id },
        id: variantId,
        template: { id: templateId },
      },
    });

    template.prompt = update.prompt;
    template.temperature = update.temperature;
    template.maxTokens = update.maxTokens;
    template.stopSequence = update.stopSequence;

    return this.promptTemplateInstanceRepository.save(template);
  }

  async getById(authContext: IAuthenticatedContext, templateId: string) {
    const template = await this.promptTemplateRepository.findOneOrFail({
      where: {
        org: { id: authContext.org.id },
        id: templateId,
      },
      relations: { instances: true },
    });

    return template.instances[0];
  }

  async compilePromptTemplateInstance(
    instance: PromptTemplateInstance,
    session: Session,
    inputPrompt: string,
  ) {
    const { tools } = await this.promptTemplateInstanceRepository.findOneOrFail(
      {
        where: { id: instance.id },
        relations: { tools: true },
      },
    );

    const compiledTools = tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join('\n');
    const compiledToolNames = tools.map((tool) => tool.name).join(', ');

    const compiledHistory = await this.compileSessionHistory(session);

    const compiledPrompt = instance.prompt
      .replace('{tools}', compiledTools)
      .replace('{tool_names}', compiledToolNames)
      .replace('{history}', compiledHistory)
      .replace('{input}', inputPrompt);

    return compiledPrompt;
  }

  async compileSessionHistory(session: Session) {
    if (session.type === 'chat') {
      // TODO: consider how to handle DAG inference trees...
      return session.inferences
        .map((inference) => {
          // TODO: multi-user chats
          return `Human: ${inference.prompt}\nAssistant: ${inference.response}`;
        })
        .join('\n');
    } else {
      return session.inferences
        .map((inference) => {
          return `${inference.prompt}\n${inference.response}`;
        })
        .join(',');
    }
  }

  async testInfer(
    authContext: IAuthenticatedContext,
    inferenceRequest: ITestInferenceRequest,
  ) {
    const templateInstance = new PromptTemplateInstance();
    templateInstance.maxTokens = inferenceRequest.maxTokens;
    templateInstance.stopSequence = inferenceRequest.stopSequence;
    templateInstance.temperature = inferenceRequest.temperature;
    templateInstance.prompt = inferenceRequest.template;
    templateInstance.tools = []; // TODO

    const session = new Session();
    session.inferences = [];

    return this.inferenceService.testInfer(
      authContext,
      inferenceRequest,
      templateInstance,
      session,
    );
  }
}
