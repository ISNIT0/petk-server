import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Inference } from 'src/database/entity/Inference.entity';
import { Profile } from 'src/database/entity/Profile.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { Session } from 'src/database/entity/Session.entity';
import { Tool } from 'src/database/entity/Tool.entity';
import { ModelProviderService } from 'src/model-provider/model-provider.service';
import { ModelService } from 'src/model/model.service';
import { ProfileService } from 'src/profile/profile.service';
import { PromptTemplateService } from 'src/prompt-template/prompt-template.service';
import { IInferenceRequest } from 'src/session/session.service';
import { In, Repository } from 'typeorm';
import { RawInferenceDTO } from './inference.controller';

@Injectable()
export class InferenceService {
  constructor(
    @Inject(forwardRef(() => ModelService))
    private modelService: ModelService,
    @Inject(forwardRef(() => PromptTemplateService))
    private promptTemplateService: PromptTemplateService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Inference)
    private inferenceRepository: Repository<Inference>,
    @InjectRepository(Tool)
    private toolRepository: Repository<Tool<any>>,
    private modelProvider: ModelProviderService,
    private profileService: ProfileService,
  ) {}

  async save(inference: Inference) {
    return this.inferenceRepository.save(inference);
  }

  async getInferenceParameters(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
  ) {
    const [model, promptTemplate] = await Promise.all([
      this.modelService.getById(authContext, inferenceRequest.model),
      this.promptTemplateService.getById(
        authContext,
        inferenceRequest.promptTemplate,
      ),
    ]);
    return { model, promptTemplate };
  }

  async testInfer(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
    templateInstance: PromptTemplateInstance,
    session: Session,
  ) {
    const [profile] = await Promise.all([
      this.profileService.getByAuthContext(authContext),
    ]);
    const model = await this.modelService.getById(
      authContext,
      inferenceRequest.model,
    );
    const tools = await this.toolRepository.find({
      where: {
        id: In(inferenceRequest.tools || []),
        org: { id: authContext.org.id },
      },
    });

    const inference = new Inference();

    inference.model = model;
    inference.tools = tools;
    // inference.previousInference; // TODO
    inference.profile = profile;
    inference.prompt = inferenceRequest.prompt;
    inference.promptTemplateInstance = templateInstance;
    inference.session = session;
    inference.maxTokensOverride = inferenceRequest.maxTokens;
    inference.type = inferenceRequest.type;
    inference.promptMergeData = inferenceRequest.promptMergeData;

    const ret = await this.modelProvider.infer(authContext, inference, session);

    inference.response = ret.response;
    return inference;
  }

  async infer(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
    session: Session,
  ) {
    const [profile] = await Promise.all([
      this.profileService.getByAuthContext(authContext),
    ]);
    const { model, promptTemplate } = await this.getInferenceParameters(
      authContext,
      inferenceRequest,
    );
    const tools = await this.toolRepository.find({
      where: {
        id: In(inferenceRequest.tools || []),
        org: { id: authContext.org.id },
      },
    });

    let inference = new Inference();

    inference.model = model;
    inference.tools = tools;
    // inference.previousInference; // TODO
    inference.profile = profile;
    inference.prompt = inferenceRequest.prompt;
    inference.promptTemplateInstance = promptTemplate;
    inference.session = session;
    inference.maxTokensOverride = inferenceRequest.maxTokens;
    inference.type = inferenceRequest.type;
    inference.toolProfile = inferenceRequest.toolProfile;
    inference.promptMergeData = inferenceRequest.promptMergeData;
    inference = await this.inferenceRepository.save(inference);

    const { response, promptSentinelResults, responseSentinelResults } =
      await this.modelProvider.infer(authContext, inference, session);

    inference.response = response;
    inference = await this.inferenceRepository.save(inference);

    await this.sessionRepository.update(session.id, {
      description: inference.response,
    });

    return { inference, promptSentinelResults, responseSentinelResults };
  }

  async createChunkedInferences(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
    session: Session,
    chunks: string[],
  ) {
    const [profile] = await Promise.all([
      this.profileService.getByAuthContext(authContext),
    ]);
    const { model, promptTemplate } = await this.getInferenceParameters(
      authContext,
      inferenceRequest,
    );
    const tools = await this.toolRepository.find({
      where: {
        id: In(inferenceRequest.tools || []),
        org: { id: authContext.org.id },
      },
    });

    const chunkedInferences = await Promise.all(
      chunks.map((chunk) => {
        const inference = new Inference();
        inference.prompt = chunk;
        inference.response = '';

        inference.model = model;
        inference.tools = tools;
        // inference.previousInference; // TODO
        inference.profile = profile;
        inference.promptTemplateInstance = promptTemplate;
        inference.session = session;
        inference.type = inferenceRequest.type;
        inference.maxTokensOverride = inferenceRequest.maxTokens;
        inference.toolProfile = inferenceRequest.toolProfile;
        inference.promptMergeData = inferenceRequest.promptMergeData;
        return this.inferenceRepository.save(inference);
      }),
    );

    return chunkedInferences;
  }

  async rawInfer(
    authContext: IAuthenticatedContext,
    inferenceRequest: RawInferenceDTO,
    session: Session,
  ) {
    const [profile] = await Promise.all([
      this.profileService.getByAuthContext(authContext),
    ]);
    const model = await this.modelService.getById(
      authContext,
      inferenceRequest.modelId,
    );
    let template: PromptTemplateInstance;
    if (inferenceRequest.templateId) {
      template = await this.promptTemplateService.getById(
        authContext,
        inferenceRequest.templateId,
      );
    }

    let inference = new Inference();

    inference.model = model;
    inference.tools = [];
    inference.promptTemplateInstance = template;
    inference.promptMergeData = inferenceRequest.promptMergeData;
    // inference.previousInference; // TODO
    inference.profile = profile;
    inference.prompt = inferenceRequest.prompt;
    inference.maxTokensOverride = inferenceRequest.maxTokens;
    inference.session = session;
    inference.type = 'api';
    inference = await this.inferenceRepository.save(inference);

    const { response, promptSentinelResults, responseSentinelResults } =
      await this.modelProvider.infer(authContext, inference, session);

    inference.response = response;
    inference = await this.inferenceRepository.save(inference);

    await this.sessionRepository.update(session.id, {
      description: inference.response,
    });

    return { inference, promptSentinelResults, responseSentinelResults };
  }

  async getPrompt(
    authContext: IAuthenticatedContext,
    inferenceRequest: IInferenceRequest,
    session: Session,
  ) {
    const { model, promptTemplate } = await this.getInferenceParameters(
      authContext,
      inferenceRequest,
    );
    const tools = await this.toolRepository.find({
      where: {
        id: In(inferenceRequest.tools || []),
        org: { id: authContext.org.id },
      },
    });

    const inference = new Inference();

    inference.model = model;
    inference.tools = tools;
    // inference.previousInference; // TODO
    inference.profile = authContext.profile as Profile;
    inference.prompt = inferenceRequest.prompt;
    inference.promptTemplateInstance = promptTemplate;
    inference.session = session;
    inference.type = inferenceRequest.type;
    inference.maxTokensOverride = inferenceRequest.maxTokens;
    inference.toolProfile = inferenceRequest.toolProfile;
    inference.promptMergeData = inferenceRequest.promptMergeData;

    const inferences = await this.getInferencesForSession(authContext, session);
    session.inferences = inferences;

    return this.modelProvider.getPrompt(authContext, model, inference, session);
  }

  async getInferencesForSession(
    authContext: IAuthenticatedContext,
    session: Session,
  ) {
    const { inferences } = await this.sessionRepository.findOneOrFail({
      where: { id: session.id },
      relations: { inferences: true },
    });

    return inferences;
  }
}
