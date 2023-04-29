import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Org } from 'src/database/entity/Org.entity';
import { Profile } from 'src/database/entity/Profile.entity';
import { PromptTemplate } from 'src/database/entity/PromptTemplate.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import {
  chatPrompt,
  instructionPrompt,
  pirateChatPrompt,
  taskCreationPrompt,
  taskExecutionPrompt,
} from 'src/fixtures/prompts';
import { Repository } from 'typeorm';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Org)
    private orgRepository: Repository<Org>,
    @InjectRepository(PromptTemplate)
    private promptTemplateRepository: Repository<PromptTemplate>,
    @InjectRepository(PromptTemplateInstance)
    private promptTemplateInstanceRepository: Repository<PromptTemplateInstance>,
  ) {}

  async getOrgByEmailDomain(domain: string) {
    return this.orgRepository.findOne({ where: { emailDomain: domain } });
  }

  async getByAuthContext(authContext: IAuthenticatedContext) {
    const org = await this.orgRepository.findOneOrFail({
      where: { id: authContext.org.id },
    });
    return org;
  }

  async createOrgForUser(profile: Profile) {
    let org = new Org();
    org.name = `Default`;
    org.orgUsers = [profile];
    org = await this.orgRepository.save(org);

    let chatPromptTemplateBasic = new PromptTemplate();
    chatPromptTemplateBasic.name = 'Chat Basic';
    chatPromptTemplateBasic.org = org;
    chatPromptTemplateBasic.promptType = 'chat';
    chatPromptTemplateBasic.description = 'A basic chat prompt';
    chatPromptTemplateBasic = await this.promptTemplateRepository.save(
      chatPromptTemplateBasic,
    );

    let chatPromptTemplateBasicInstance = new PromptTemplateInstance();
    chatPromptTemplateBasicInstance.org = org;
    chatPromptTemplateBasicInstance.maxTokens = 1000;
    chatPromptTemplateBasicInstance.stopSequence = null;
    chatPromptTemplateBasicInstance.temperature = 0;
    chatPromptTemplateBasicInstance.description = 'Standard Chat Prompt';
    chatPromptTemplateBasicInstance.template = chatPromptTemplateBasic;
    chatPromptTemplateBasicInstance.prompt = chatPrompt;
    chatPromptTemplateBasicInstance =
      await this.promptTemplateInstanceRepository.save(
        chatPromptTemplateBasicInstance,
      );

    let chatPromptTemplatePirate = new PromptTemplate();
    chatPromptTemplatePirate.name = 'Chat Pirate';
    chatPromptTemplatePirate.org = org;
    chatPromptTemplatePirate.promptType = 'chat';
    chatPromptTemplatePirate.description = 'A Pirate chat prompt';
    chatPromptTemplatePirate = await this.promptTemplateRepository.save(
      chatPromptTemplatePirate,
    );

    let chatPromptTemplatePirateInstance = new PromptTemplateInstance();
    chatPromptTemplatePirateInstance.org = org;
    chatPromptTemplatePirateInstance.maxTokens = 1000;
    chatPromptTemplatePirateInstance.stopSequence = null;
    chatPromptTemplatePirateInstance.temperature = 0;
    chatPromptTemplatePirateInstance.description =
      'Standard Chat Prompt, but a Pirate';
    chatPromptTemplatePirateInstance.prompt = pirateChatPrompt;
    chatPromptTemplatePirateInstance.template = chatPromptTemplatePirate;
    chatPromptTemplatePirateInstance =
      await this.promptTemplateInstanceRepository.save(
        chatPromptTemplatePirateInstance,
      );

    let instructionPromptTemplate = new PromptTemplate();
    instructionPromptTemplate.name = 'Standard Tool-Using Bot';
    instructionPromptTemplate.org = org;
    instructionPromptTemplate.promptType = 'instruction';
    instructionPromptTemplate.description = 'A standard tool-using bot';
    instructionPromptTemplate = await this.promptTemplateRepository.save(
      instructionPromptTemplate,
    );

    let instructionPromptTemplateInstance = new PromptTemplateInstance();
    instructionPromptTemplateInstance.org = org;
    instructionPromptTemplateInstance.maxTokens = 1000;
    instructionPromptTemplateInstance.stopSequence = 'Observation:';
    instructionPromptTemplateInstance.temperature = 0;
    instructionPromptTemplateInstance.description = 'Standard Tool-Using Bot';
    instructionPromptTemplateInstance.prompt = instructionPrompt;
    instructionPromptTemplateInstance.template = instructionPromptTemplate;
    instructionPromptTemplateInstance =
      await this.promptTemplateInstanceRepository.save(
        instructionPromptTemplateInstance,
      );

    let taskExecutionPromptTemplate = new PromptTemplate();
    taskExecutionPromptTemplate.name = 'Task Execution';
    taskExecutionPromptTemplate.org = org;
    taskExecutionPromptTemplate.promptType = 'instruction';
    taskExecutionPromptTemplate.description = 'A Task Execution Prompt';
    taskExecutionPromptTemplate = await this.promptTemplateRepository.save(
      taskExecutionPromptTemplate,
    );

    let taskExecutionPromptTemplateInstance = new PromptTemplateInstance();
    taskExecutionPromptTemplateInstance.org = org;
    taskExecutionPromptTemplateInstance.maxTokens = 1000;
    // taskExecutionPromptTemplateInstance.stopSequence = 'Observation:';
    taskExecutionPromptTemplateInstance.temperature = 0;
    taskExecutionPromptTemplateInstance.description = 'A Task Execution Prompt';
    taskExecutionPromptTemplateInstance.prompt = taskExecutionPrompt;
    taskExecutionPromptTemplateInstance.template = taskExecutionPromptTemplate;
    taskExecutionPromptTemplateInstance =
      await this.promptTemplateInstanceRepository.save(
        taskExecutionPromptTemplateInstance,
      );

    let taskCreationPromptTemplate = new PromptTemplate();
    taskCreationPromptTemplate.name = 'Task Execution';
    taskCreationPromptTemplate.org = org;
    taskCreationPromptTemplate.promptType = 'instruction';
    taskCreationPromptTemplate.description = 'A Task Execution Prompt';
    taskCreationPromptTemplate = await this.promptTemplateRepository.save(
      taskCreationPromptTemplate,
    );

    let taskCreationPromptTemplateInstance = new PromptTemplateInstance();
    taskCreationPromptTemplateInstance.org = org;
    taskCreationPromptTemplateInstance.maxTokens = 1000;
    // taskCreationPromptTemplateInstance.stopSequence = 'Observation:';
    taskCreationPromptTemplateInstance.temperature = 0;
    taskCreationPromptTemplateInstance.description = 'A Task Execution Prompt';
    taskCreationPromptTemplateInstance.prompt = taskCreationPrompt;
    taskCreationPromptTemplateInstance.template = taskCreationPromptTemplate;
    taskCreationPromptTemplateInstance =
      await this.promptTemplateInstanceRepository.save(
        taskCreationPromptTemplateInstance,
      );
    return org;
  }
}
